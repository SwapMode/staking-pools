// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20MetadataMock is ERC20("ERC20MetadataMock", "MOCK") {
    uint8 private immutable _decimals;

    constructor(uint8 _decimalCount) {
        require(_decimalCount <= 18 && _decimalCount > 0, "Invalid decimals");
        _decimals = _decimalCount;

        // _mint(msg.sender, 10000 ether);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}
