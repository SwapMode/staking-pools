import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';

export async function deploySmartChefFactory(signer: SignerWithAddress) {
  const fact = await ethers.getContractFactory('SmartChefFactory', signer);
  const instance = await fact.deploy();
  await instance.deployed();
  console.log('SmartChefFactory deployed at: ' + instance.address);
  return instance;
}

// function deployPool(
//   IBEP20 _stakedToken,
//   IBEP20 _rewardToken,
//   uint256 _rewardPerBlock,
//   uint256 _startBlock,
//   uint256 _bonusEndBlock,
//   uint256 _poolLimitPerUser,
//   address _admin
// ) external onlyOwner {
export async function createSmartPool(
  smartFactory: string,
  bswap: string,
  rewardToken: string,
  rewardPerSec: BigNumber | string | number,
  _startTime: number,
  signer: SignerWithAddress,
  treasury: string,
  _bonusEndTime = ethers.constants.MaxUint256.toString()
) {
  const factory = await ethers.getContractAt('SmartChefFactory', smartFactory, signer);

  const tx = await factory.deployPool(
    bswap,
    rewardToken,
    rewardPerSec,
    _startTime,
    _bonusEndTime,
    0,
    treasury,
    treasury
  );
  const rx = tx.wait(3);
  const smartChef = (await rx).events.find((evt) => evt.event === 'NewSmartChefContract');
  console.log('New smartChef: ' + smartChef.args.smartChef);
}
