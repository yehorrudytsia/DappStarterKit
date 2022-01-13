pragma solidity ^0.8.9;

contract ValueLocked {
    uint256 public valueLocked;
    address public owner; 

    constructor(address _owner, uint256 _valueLocked) {
        valueLocked = _valueLocked;
        owner = _owner;
    }

    function unlock() external view returns (uint256) {
        require(owner == msg.sender);
        return valueLocked;
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
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
        locked = new ValueLocked(msg.sender, totalSupply/2);
    }


    function transfer(address to, uint256 amount) external {

        require(balances[msg.sender] >= amount, "Not enough tokens");

        balances[msg.sender] -= amount;
        balances[to] += amount;
    }


    function getBalance(address account) external view returns (uint256) {
        return balances[account];
    }
}