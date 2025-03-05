import React from 'react';

function ConnectWallet({ account, onConnect }) {
  return (
    <div className="connect-wallet">
      {account ? (
        <div>Connected: {account.substring(0, 6)}...{account.substring(38)}</div>
      ) : (
        <button onClick={onConnect}>Connect Wallet</button>
      )}
    </div>
  );
}

export default ConnectWallet;
