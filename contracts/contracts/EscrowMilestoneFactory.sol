// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./EscrowMilestoneERC20.sol";

contract EscrowMilestoneFactory {
    address[] public allEscrows;

    event EscrowMilestoneCreated(address indexed escrow, address indexed payer, address indexed payee);

    function createEscrowMilestone(address payer, address payee, address arbiter, address token, uint256 totalAmount, uint256 m1Amount, uint256 m2Amount) external returns (address) {
        EscrowMilestoneERC20 escrow = new EscrowMilestoneERC20(payer, payee, arbiter, token, totalAmount, m1Amount, m2Amount);
        allEscrows.push(address(escrow));
        emit EscrowMilestoneCreated(address(escrow), payer, payee);
        return address(escrow);
    }

    function allEscrowsLength() external view returns (uint256) { return allEscrows.length; }
}