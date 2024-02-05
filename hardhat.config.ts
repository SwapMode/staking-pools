import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-etherscan';

dotenv.config();

const accounts = process.env.DEV_KEY !== undefined ? [process.env.DEV_KEY] : [];

const config: HardhatUserConfig = {
  solidity: {
    version: '0.6.12',
    settings: {
      optimizer: {
        enabled: true,
        runs: 99999,
      },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
    customChains: [
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org',
          browserURL: 'https://basescan.org',
        },
      },
    ],
  },
  networks: {
    hardhat: {
      // forking: {
      //   url: process.env.ARBITRUM_RPC || '',
      //   blockNumber: 113767147,
      // },
    },
    arbitrum: {
      url: process.env.ARBITRUM_RPC || '',
      accounts,
      chainId: 42161,
    },
    arbitrum_goerli: {
      url: process.env.ARBITRUM_GOERLI_RPC || '',
      accounts,
      chainId: 421613,
    },
    optimism: {
      url: `${process.env.OPTIMISM_RPC}`,
      accounts,
      chainId: 10,
    },
    optimism_goerli: {
      url: `${process.env.OPTIMISM_GOERLI_RPC}`,
      accounts,
      chainId: 420,
    },
    base: {
      url: process.env.BASE_RPC || '',
      accounts,
      chainId: 8453,
    },
    baseGoerli: {
      url: process.env.BASE_GOERLI_RPC,
      accounts,
      chainId: 84531,
    },
    mode: {
      url: process.env.MODE_RPC || '',
      accounts,
      chainId: 34443,
    },
    modeTestnet: {
      url: process.env.MODE_TESTNET_RPC || '',
      accounts,
      chainId: 919,
    },
  },
};

export default config;
