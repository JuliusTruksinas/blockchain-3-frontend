import { useEffect, useState } from 'react';

interface EthereumProvider {
  request<T = unknown>(args: { method: string; params?: unknown[] }): Promise<T>;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export function SecretWalletGate() {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    const provider = window.ethereum;

    if (!provider?.request) {
      setError('MetaMask not detected. Install the extension and refresh this page.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const nextAccounts = await provider.request<string[]>({ method: 'eth_requestAccounts' });
      setAccounts(Array.isArray(nextAccounts) ? nextAccounts : []);
    } catch (err) {
      if ((err as { code?: number }).code === 4001) {
        setError('Connection request rejected in MetaMask.');
      } else {
        setError((err as Error).message || 'Failed to connect to MetaMask.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    connectWallet().catch(() => {
      // Errors already captured via state above.
    });
  }, []);

  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050b1a' }}
      className="min-h-screen bg-slate-950 flex items-center justify-center"
    >
      <div
        style={{ background: '#0f172a', borderRadius: '1rem', padding: '2rem', minWidth: '320px', textAlign: 'center', color: '#e2e8f0' }}
        className="bg-slate-900/80 rounded-2xl p-8 shadow-xl text-center space-y-4"
      >
        <h1 className="text-2xl font-semibold text-slate-100">Secret Wallet Gate</h1>
        {error && (
          <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
            {error}
          </div>
        )}
        <p className="text-sm text-slate-400">
          Connected wallets:&nbsp;
          <span className="font-mono text-slate-200">
            {accounts.length > 0 ? `${accounts.length} selected` : 'None'}
          </span>
        </p>
        {accounts.length > 0 && (
          <ul className="space-y-2 text-left text-xs font-mono text-slate-300">
            {accounts.map(account => (
              <li
                key={account}
                className="rounded border border-slate-700 bg-slate-800/60 px-3 py-2"
              >
                {account}
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="rounded-lg bg-indigo-500 px-6 py-2 text-sm font-medium text-white shadow transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          {isConnecting ? 'Connecting…' : accounts.length > 0 ? 'Reconnect Wallets' : 'Connect Wallets'}
        </button>
        <p className="text-xs text-slate-500">
          Add wallets in MetaMask, then click connect to include them all.
        </p>
      </div>
    </div>
  );
}
