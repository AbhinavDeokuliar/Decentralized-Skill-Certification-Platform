import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function CertificateLookup({ contract }) {
  const [searchParams] = useSearchParams();
  const [address, setAddress] = useState(searchParams.get('address') || '');
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (address && contract) {
      handleSubmit(new Event('submit'));
    }
  }, [contract]); // Run when contract is available

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const certIds = await contract.getCertificationsByRecipient(address);
      const certsDetails = await Promise.all(
        certIds.map(async (id) => {
          const cert = await contract.getCertificationById(id);
          return {
            id: cert.id.toString(),
            skill: cert.skill,
            level: cert.level,
            issuer: cert.issuer,
            timestamp: new Date(cert.timestamp * 1000).toLocaleString()
          };
        })
      );
      setCertificates(certsDetails);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setError('Error fetching certificates. Please verify the address.');
    }
    setLoading(false);
  };

  return (
    <div className="certificate-lookup">
      <h2>Look Up Certificates</h2>
      <form onSubmit={handleSubmit} className="lookup-form">
        <input
          type="text"
          placeholder="Enter Ethereum Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {certificates.length > 0 && (
        <div className="certificates-results">
          <h3>Certificates Found</h3>
          <div className="certification-grid">
            {certificates.map((cert) => (
              <div key={cert.id} className="certification-card">
                <h4>Certificate #{cert.id}</h4>
                <p>Skill: {cert.skill}</p>
                <p>Level: {cert.level}</p>
                <p>Issuer: {cert.issuer.substring(0, 6)}...{cert.issuer.substring(38)}</p>
                <p>Issued: {cert.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && certificates.length === 0 && address && (
        <p>No certificates found for this address.</p>
      )}
    </div>
  );
}

export default CertificateLookup;
