import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';

const DEFAULT_RPC_URL = 'https://sepolia.infura.io/v3/051ed9cad5d54bff9f58136695bbc577';

const rpcUrl = DEFAULT_RPC_URL;

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(rpcUrl),
});

export async function getWalletClient() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask provider not detected');
  }

  return createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  });
}

declare global {
  interface Window {
    ethereum?: {
      request: <T = unknown>(args: { method: string; params?: unknown[] }) => Promise<T>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}
