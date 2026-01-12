// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Counter {
    uint public x;

    event Increment(uint by);
    event Decrement(uint by);

    function inc() public {
        x++;
        emit Increment(1);
    }

    function dec() public {
        require(x > 0, "dec: counter cannot be decremented below zero");
        x--;
        emit Decrement(1);
    }

    function incBy(uint by) public {
        require(by > 0, "incBy: increment should be positive");
        x += by;
        emit Increment(by);
    }

    function decBy(uint by) public {
        require(by > 0, "decBy: decrement should be positive");
        require(x >= by, "decBy: counter cannot be decremented below zero");
        x -= by;
        emit Decrement(by);
    }
}
