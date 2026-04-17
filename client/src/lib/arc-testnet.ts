import { defineChain } from 'viem';

/**
 * Arc Testnet configuration
 * Chain ID: 5042002
 * USDC Contract: 0x3600000000000000000000000000000000000000
 * RPC: https://rpc.testnet.arc.network
 */
export const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'USDC',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.arc.network'],
      webSocket: ['wss://rpc.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Arcscan',
      url: 'https://testnet.arcscan.app',
    },
  },
  testnet: true,
});

/**
 * USDC Contract Address on Arc Testnet
 */
export const USDC_ADDRESS = '0x3600000000000000000000000000000000000000' as const;

/**
 * Arc Testnet Configuration Constants
 */
export const ARC_CONFIG = {
  chainId: 5042002,
  chainName: 'Arc Testnet',
  rpcUrl: 'https://rpc.testnet.arc.network',
  wsUrl: 'wss://rpc.testnet.arc.network',
  explorerUrl: 'https://testnet.arcscan.app',
  faucetUrl: 'https://faucet.circle.com',
  usdcAddress: USDC_ADDRESS,
  usdcDecimals: 6,
  gasDecimals: 18,
  cctp_domain: 26,
};
