import { BigNumber, Contract, ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import * as helpers from '@nomicfoundation/hardhat-network-helpers';
import * as erc20 from '../node_modules/@openzeppelin/contracts/build/contracts/ERC20.json';

export const keccak256 = ethers.utils.solidityKeccak256;

export async function getBlockTime(provider) {
  const block = await provider.getBlock(await provider.getBlockNumber());

  return block.timestamp;
}

export const giveTokens = async (
  tokenAddress: string,
  tokenBalanceOfStorageSlot: number,
  receiverAddress: string,
  amount: BigNumber
) => {
  const indexHash = prepBalanceStorageSlotWrite(receiverAddress, tokenBalanceOfStorageSlot);
  await helpers.setStorageAt(tokenAddress, indexHash, toBytes32(amount).toString());
  await helpers.mine(1);
};

export const prepBalanceStorageSlotWrite = (receiverAddress: string, storageSlot: number) => {
  return ethers.utils.solidityKeccak256(
    ['uint256', 'uint256'],
    [receiverAddress, storageSlot] // key, slot - solidity mappings storage = keccak256(mapping key value, value at that key)
  );
};

export const toBytes32 = (bn: BigNumber) => {
  return ethers.utils.hexlify(ethers.utils.zeroPad(bn.toHexString(), 32));
};

export const setStorageAt = async (
  provider: ethers.providers.JsonRpcProvider,
  contractAddress: string,
  index: string,
  value: BigNumber
) => {
  await provider.send('hardhat_setStorageAt', [contractAddress, index, toBytes32(value).toString()]);
  await provider.send('evm_mine', []); // Just mines to the next block
};

export const giveTokenBalanceFor = async (
  provider: ethers.providers.JsonRpcProvider,
  contractAddress: string,
  addressToSet: string,
  storageSlot: number,
  amount: BigNumber
) => {
  const index = prepBalanceStorageSlotWrite(addressToSet, storageSlot);
  await setStorageAt(provider, contractAddress, index, amount);
};

export function getERC20(address: string, signer) {
  return new Contract(address, erc20.abi, signer);
}

export function getRandomBytes32() {
  const values = ['1', '2', '64', , '128', '256'];
  const rand = Math.round(Math.random() * (values.length - 1));

  return ethers.utils.hexZeroPad(parseEther(values[rand]).toHexString(), 32);
}

/**
 * Replicates error string return from OpenZeppelin AccessControl contract
 */
export function getAccessControlRevertString(account: string, role: string) {
  return `AccessControl: account ${account.toLowerCase()} is missing role ${role}`;
}
