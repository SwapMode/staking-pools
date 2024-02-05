import { ethers } from 'hardhat';

import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { getBlockTime } from '../test/utils';
import { createSmartPool, deploySmartChefFactory } from './utils/setup';

const DEV_ACCOUNT = '0x03d4C4b1B115c068Ef864De2e21E724a758892A2';
const TREASURY = DEV_ACCOUNT;
const SMART_FACTORY = '';
const STAKING_TOKEN = '';

async function main() {
  await ethers.provider.ready;
  const signer = (await ethers.getSigners())[0];

  await deploySmartChefFactory(signer);

  // const startFromNow = 1800;
  // await createStakingPool(startFromNow);
  // await createFarms();
}

async function createStakingPool(startFromNow: number) {
  //  create and transfer tokens to staker(s)
  const signer = (await ethers.getSigners())[0];
  const blockTime = await getBlockTime(ethers.provider);

  const staker = {
    token: 'WETH',
    rewardToken: '0x4200000000000000000000000000000000000006',
    rewardPerSec: parseUnits('0.000003507295173961'),
  };

  console.log(`Creating staker for ${staker.token}`);
  await createSmartPool(
    SMART_FACTORY,
    STAKING_TOKEN,
    staker.rewardToken,
    staker.rewardPerSec,
    blockTime + startFromNow,
    signer,
    TREASURY
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
