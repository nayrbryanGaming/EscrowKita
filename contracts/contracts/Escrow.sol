// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Escrow {
    address public payer;
    address public payee;
    address public arbiter;
    uint256 public amount;
    uint256 public fundedAt;
    bool public released;
    bool public refunded;

    event Funded(address indexed payer, uint256 amount);
    event ProofSubmitted(address indexed by, string proof);
    event Approved(address indexed by);
    event Released(address indexed to, uint256 amount);
    event Refunded(address indexed to, uint256 amount);
    event TimeoutClaimed(address indexed by);

    constructor(address _payer, address _payee, address _arbiter, uint256 _amount) payable {
        payer = _payer;
        payee = _payee;
        arbiter = _arbiter;
        amount = _amount;
    }

    modifier onlyPayer() {
        require(msg.sender == payer, "only payer");
        _;
    }

    modifier onlyArbiter() {
        require(msg.sender == arbiter, "only arbiter");
        _;
    }

    function fund() external payable onlyPayer {
        require(msg.value == amount, "wrong amount");
        fundedAt = block.timestamp;
        emit Funded(msg.sender, msg.value);
    }

    function submitProof(string calldata proof) external {
        emit ProofSubmitted(msg.sender, proof);
    }

    function approveAndRelease() external onlyArbiter {
        require(!released && !refunded, "already finalized");
        released = true;
        uint256 bal = address(this).balance;
        payable(payee).transfer(bal);
        emit Approved(msg.sender);
        emit Released(payee, bal);
    }

    function refund() external onlyArbiter {
        require(!released && !refunded, "already finalized");
        refunded = true;
        uint256 bal = address(this).balance;
        payable(payer).transfer(bal);
        emit Refunded(payer, bal);
    }

    // allow payer to claim timeout back after long duration (e.g., 30 days)
    function claimTimeout(uint256 timeoutSeconds) external onlyPayer {
        require(fundedAt > 0, "not funded");
        require(block.timestamp >= fundedAt + timeoutSeconds, "too early");
        require(!released && !refunded, "already finalized");
        refunded = true;
        uint256 bal = address(this).balance;
        payable(payer).transfer(bal);
        emit TimeoutClaimed(msg.sender);
        emit Refunded(payer, bal);
    }
}
