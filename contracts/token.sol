//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract ValueLocked {
    uint256 public valueLocked;
    address public owner;

    constructor(address _owner, uint256 _valueLocked) {
        valueLocked = _valueLocked;
        owner = _owner;
    }

    function unlock(address sender, uint amount) external returns (uint256) {
        require(owner == sender);
        valueLocked -= amount;
        uint256 valueUnlocked = amount;
        return valueUnlocked;
    }
}

contract Token {
    string public name = "Starter Kit Token";
    string public symbol = "SKT";
    uint256 public totalSupply = 100000000;
    ValueLocked locked;

    address public owner;

    mapping(address => uint256) balances;

    constructor() {
        owner = msg.sender;
        balances[msg.sender] = totalSupply/2;
        locked = new ValueLocked(msg.sender, totalSupply/2);
    }


    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Not enough tokens");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function valueLocked() public view returns (uint256) {
        return totalSupply / 2;
    }

    function getBalance(address account) external view returns (uint256) {
        return balances[account];
    }

    function unlockTokens(uint amount, address to) external {
        require(msg.sender == owner, "Only owner is legible to unlock tokens");
        uint256 unlocked = locked.unlock(msg.sender, amount);
        balances[owner] += unlocked;
        transfer(to, unlocked);
    }
}