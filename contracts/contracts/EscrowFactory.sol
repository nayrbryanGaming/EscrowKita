// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./Escrow.sol";

contract EscrowFactory {
    event EscrowCreated(address indexed escrowAddress, address indexed payer, address indexed payee, address arbiter, uint256 amount);

    address[] public escrows;

    function createEscrow(address payer, address payee, address arbiter, uint256 amount) external returns (address) {
        Escrow e = new Escrow(payer, payee, arbiter, amount);
        escrows.push(address(e));
        emit EscrowCreated(address(e), payer, payee, arbiter, amount);
        return address(e);
    }

    function allEscrows() external view returns (address[] memory) {
        return escrows;
    }
}
