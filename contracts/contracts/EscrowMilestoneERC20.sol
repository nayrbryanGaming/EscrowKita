// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EscrowMilestoneERC20 {
    struct Milestone { uint256 amount; bool funded; bool submitted; string proof; bool released; }

    address public payer;
    address public payee;
    address public arbiter;
    IERC20 public token;
    uint256 public totalAmount;
    Milestone[2] public milestones;

    event EscrowCreated(address indexed payer, address indexed payee, address indexed arbiter, address token, uint256 totalAmount);
    event Funded(uint256 indexed index, address indexed by, uint256 amount);
    event ProofSubmitted(uint256 indexed index, address indexed by, string proof);
    event Approved(uint256 indexed index, address indexed by);
    event Released(uint256 indexed index, address indexed to, uint256 amount);
    event Refunded(uint256 indexed index, address indexed to, uint256 amount);

    constructor(address _payer, address _payee, address _arbiter, address _token, uint256 _totalAmount, uint256 m1Amount, uint256 m2Amount) {
        payer = _payer; payee = _payee; arbiter = _arbiter; token = IERC20(_token); totalAmount = _totalAmount;
        milestones[0].amount = m1Amount; milestones[1].amount = m2Amount;
        emit EscrowCreated(_payer, _payee, _arbiter, _token, _totalAmount);
    }

    modifier onlyPayer() { require(msg.sender == payer, "only payer"); _; }
    modifier onlyPayerOrArbiter() { require(msg.sender == payer || msg.sender == arbiter, "only payer or arbiter"); _; }

    function fundMilestone(uint256 index) external onlyPayer {
        require(index < 2, "invalid index");
        Milestone storage m = milestones[index];
        require(!m.funded, "already funded");
        require(token.transferFrom(msg.sender, address(this), m.amount), "transfer failed");
        m.funded = true; emit Funded(index, msg.sender, m.amount);
    }

    function submitProofForMilestone(uint256 index, string calldata proof) external {
        require(msg.sender == payee, "only payee");
        require(index < 2, "invalid index");
        Milestone storage m = milestones[index];
        m.submitted = true; m.proof = proof; emit ProofSubmitted(index, msg.sender, proof);
    }

    function approveMilestone(uint256 index) external onlyPayerOrArbiter {
        require(index < 2, "invalid index");
        Milestone storage m = milestones[index];
        require(m.funded, "not funded");
        require(!m.released, "already released");
        m.released = true; emit Approved(index, msg.sender);
        require(token.transfer(payee, m.amount), "transfer failed");
        emit Released(index, payee, m.amount);
    }

    function refundMilestone(uint256 index) external onlyPayerOrArbiter {
        require(index < 2, "invalid index");
        Milestone storage m = milestones[index];
        require(m.funded, "not funded");
        require(!m.released, "already released");
        m.funded = false; emit Refunded(index, payer, m.amount);
        require(token.transfer(payer, m.amount), "transfer failed");
    }
}