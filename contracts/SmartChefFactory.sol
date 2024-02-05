// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IBEP20.sol";

import "./SmartChefInitializable.sol";

contract SmartChefFactory is Ownable {
    event NewSmartChefContract(address indexed smartChef);

    constructor() public {}

    /*
     * @notice Deploy the pool
     * @param _stakedToken: staked token address
     * @param _rewardToken: reward token address
     * @param _rewardPerSec: reward per sec (in rewardToken)
     * @param _startTime: start
     * @param _endTime: end
     * @param _poolLimitPerUser: pool limit per user in stakedToken (if any, else 0)
     * @param _admin: admin address with ownership
     * @return address of new smart chef contract
     */
    function deployPool(
        IBEP20 _stakedToken,
        IBEP20 _rewardToken,
        uint256 _rewardPerSec,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _poolLimitPerUser,
        address _admin,
        address _treasury
    ) external onlyOwner {
        require(_stakedToken.totalSupply() >= 0, "Stake token has no supply");
        require(_rewardToken.totalSupply() >= 0, "Reward token has no supply");
        require(_stakedToken != _rewardToken, "Tokens must be be different");

        bytes memory bytecode = type(SmartChefInitializable).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(_stakedToken, _rewardToken, _startTime));
        address smartChefAddress;

        assembly {
            smartChefAddress := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }

        SmartChefInitializable(smartChefAddress).initialize(
            _stakedToken,
            _rewardToken,
            _rewardPerSec,
            _startTime,
            _endTime,
            _poolLimitPerUser,
            _admin,
            _treasury
        );

        emit NewSmartChefContract(smartChefAddress);
    }
}
