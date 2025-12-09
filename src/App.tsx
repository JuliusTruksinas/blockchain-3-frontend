import { useEffect, useState } from 'react';

function App() {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);
      } catch (err) {
        console.error('User rejected the request');
      }
    } else {
      alert("MetaMask not detected!");
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-xl p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold">Tutor Marketplace DApp</h1>
        <p className="text-gray-600">
          Connected Wallet:
          <span className="font-mono ml-2">
            {account ? account : 'Not connected'}
          </span>
        </p>
        <button
          onClick={connectWallet}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {account ? 'Reconnect Wallet' : 'Connect Wallet'}
        </button>
      </div>
    </div>
  );
}

export default App;