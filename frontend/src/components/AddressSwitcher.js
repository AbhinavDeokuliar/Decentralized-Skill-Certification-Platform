import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function AddressSwitcher({ onSwitch, currentAccount, isIssuer }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAddress || !/^0x[a-fA-F0-9]{40}$/.test(newAddress)) {
      setError('Please enter a valid Ethereum address');
      return;
    }
    setError('');
    onSwitch(newAddress);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        className="address-switcher-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="toggle-icon">{isOpen ? '×' : '⚙'}</span>
        <span className="toggle-text">Switch Address</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              className="sidebar-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              className="address-switcher-sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <div className="sidebar-content">
                <h3>Switch Address</h3>
                <div className="current-status">
                  <span className="status-label">Current Role:</span>
                  <span className={`status-value ${isIssuer ? 'issuer' : 'recipient'}`}>
                    {isIssuer ? 'Issuer' : 'Recipient'}
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="switcher-form">
                  <input
                    type="text"
                    placeholder="Enter Ethereum Address"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="address-input"
                  />
                  <button type="submit" className="switch-button ripple">
                    Switch
                  </button>
                </form>
                {error && <div className="error-message">{error}</div>}

                <div className="current-address">
                  <small>Current Address:</small>
                  <code>{currentAccount}</code>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default AddressSwitcher;
