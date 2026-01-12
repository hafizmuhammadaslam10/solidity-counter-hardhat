import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("Counter", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  it("Should emit the Increment event when calling the inc() function", async function () {
    const counter = await viem.deployContract("Counter");

    await viem.assertions.emitWithArgs(
      counter.write.inc(),
      counter,
      "Increment",
      [1n],
    );
  });

  it("The sum of the Increment events should match the current value", async function () {
    const counter = await viem.deployContract("Counter");
    const deploymentBlockNumber = await publicClient.getBlockNumber();

    // run a series of increments
    for (let i = 1n; i <= 10n; i++) {
      await counter.write.incBy([i]);
    }

    const events = await publicClient.getContractEvents({
      address: counter.address,
      abi: counter.abi,
      eventName: "Increment",
      fromBlock: deploymentBlockNumber,
      strict: true,
    });

    // check that the aggregated events match the current value
    let total = 0n;
    for (const event of events) {
      total += event.args.by;
    }

    assert.equal(total, await counter.read.x());
  });

  it("Should emit the Decrement event when calling the dec() function", async function () {
    const counter = await viem.deployContract("Counter");

    // First increment to have a value to decrement
    await counter.write.inc();

    await viem.assertions.emitWithArgs(
      counter.write.dec(),
      counter,
      "Decrement",
      [1n],
    );
  });

  it("The value should correctly reflect increments and decrements", async function () {
    const counter = await viem.deployContract("Counter");
    const deploymentBlockNumber = await publicClient.getBlockNumber();

    // run a series of increments
    for (let i = 1n; i <= 5n; i++) {
      await counter.write.incBy([i]);
    }

    // run a series of decrements
    for (let i = 1n; i <= 3n; i++) {
      await counter.write.decBy([i]);
    }

    // Get all increment events
    const incrementEvents = await publicClient.getContractEvents({
      address: counter.address,
      abi: counter.abi,
      eventName: "Increment",
      fromBlock: deploymentBlockNumber,
      strict: true,
    });

    // Get all decrement events
    const decrementEvents = await publicClient.getContractEvents({
      address: counter.address,
      abi: counter.abi,
      eventName: "Decrement",
      fromBlock: deploymentBlockNumber,
      strict: true,
    });

    // Calculate net value
    let total = 0n;
    for (const event of incrementEvents) {
      total += event.args.by;
    }
    for (const event of decrementEvents) {
      total -= event.args.by;
    }

    assert.equal(total, await counter.read.x());
  });
});
