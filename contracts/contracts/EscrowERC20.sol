// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EscrowERC20 {
    address public payer;
    address public payee;
    address public arbiter;
    IERC20 public token;
    uint256 public amount;
    uint256 public fundedAt;
    bool public released;
    bool public refunded;
    bool public submitted;
    string public lastProof;

    event Funded(address indexed payer, uint256 amount);
    event ProofSubmitted(address indexed by, string proof);
    event Approved(address indexed by);
    event Released(address indexed to, uint256 amount);
    event Refunded(address indexed to, uint256 amount);

    constructor(address _payer, address _payee, address _arbiter, address _token, uint256 _amount) {
        payer = _payer;
        payee = _payee;
        arbiter = _arbiter;
        token = IERC20(_token);
        amount = _amount;
    }

    modifier onlyPayer() { require(msg.sender == payer, "only payer"); _; }
    modifier onlyArbiter() { require(msg.sender == arbiter, "only arbiter"); _; }
    modifier onlyPayerOrArbiter() { require(msg.sender == payer || msg.sender == arbiter, "only payer or arbiter"); _; }

    function fund() external onlyPayer {
        require(fundedAt == 0, "already funded");
        require(token.transferFrom(msg.sender, address(this), amount), "transfer failed");
        fundedAt = block.timestamp;
        emit Funded(msg.sender, amount);
    }

    function submitProof(string calldata proof) external {
        require(msg.sender == payee, "only payee");
        submitted = true;
        lastProof = proof;
        emit ProofSubmitted(msg.sender, proof);
    }

    function approve() external onlyPayerOrArbiter {
        require(!released, "already released");
        released = true;
        emit Approved(msg.sender);
        require(token.transfer(payee, amount), "transfer failed");
        emit Released(payee, amount);
    }

    function refund() external onlyPayerOrArbiter {
        require(!refunded, "already refunded");
        refunded = true;
        require(token.transfer(payer, amount), "transfer failed");
        emit Refunded(payer, amount);
    }
}