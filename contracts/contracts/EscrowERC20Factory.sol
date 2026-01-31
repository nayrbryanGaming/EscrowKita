// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./EscrowERC20.sol";

contract EscrowERC20Factory {
    event EscrowCreated(address indexed escrowAddress, address indexed payer, address indexed payee, address arbiter, address token, uint256 amount);

    address[] public escrows;

    function createEscrowERC20(address payer, address payee, address arbiter, address token, uint256 amount) external returns (address) {
        EscrowERC20 escrow = new EscrowERC20(payer, payee, arbiter, token, amount);
        escrows.push(address(escrow));
        emit EscrowCreated(address(escrow), payer, payee, arbiter, token, amount);
        return address(escrow);
    }

    function allEscrows() external view returns (address[] memory) {
        return escrows;
    }
}