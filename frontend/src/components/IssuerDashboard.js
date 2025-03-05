import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function IssuerDashboard({ contract, account }) {
  const [issuedCertifications, setIssuedCertifications] = useState([]);
  const [recipientStats, setRecipientStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIssuedCertifications = async () => {
      try {
        const certIds = await contract.getCertificationsByIssuer(account);
        const certsDetails = await Promise.all(
          certIds.map(async (id) => {
            const cert = await contract.getCertificationById(id);
            return {
              id: cert.id.toString(),
              skill: cert.skill,
              level: cert.level,
              recipient: cert.recipient,
              timestamp: new Date(cert.timestamp * 1000).toLocaleString()
            };
          })
        );

        // Calculate stats per recipient
        const stats = certsDetails.reduce((acc, cert) => {
          acc[cert.recipient] = (acc[cert.recipient] || 0) + 1;
          return acc;
        }, {});

        setIssuedCertifications(certsDetails);
        setRecipientStats(stats);
        setLoading(false);
      } catch (error) {
        console.error('Error loading issued certifications:', error);
        setLoading(false);
      }
    };

    if (contract && account) {
      loadIssuedCertifications();
    }
  }, [contract, account]);

  if (loading) return <div className="loading-spinner" />;

  return (
    <div className="issuer-dashboard">
      <h2>Issued Certifications</h2>
      
      <div className="recipients-summary">
        <h3>Recipients Overview</h3>
        <div className="recipients-grid">
          {Object.entries(recipientStats).map(([recipient, count]) => (
            <div key={recipient} className="recipient-card">
              <p className="recipient-address">
                Recipient: {recipient.substring(0, 6)}...{recipient.substring(38)}
              </p>
              <p className="cert-count">Certificates Issued: {count}</p>
              <Link to={`/lookup?address=${recipient}`} className="view-certs-link">
                View Certificates
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="certifications-list">
        <h3>All Issued Certificates</h3>
        <div className="certification-grid">
          {issuedCertifications.map((cert) => (
            <div key={cert.id} className="certification-card">
              <h4>Certificate #{cert.id}</h4>
              <p>Skill: {cert.skill}</p>
              <p>Level: {cert.level}</p>
              <p className="recipient-info">
                Recipient: 
                <Link to={`/lookup?address=${cert.recipient}`}>
                  {cert.recipient.substring(0, 6)}...{cert.recipient.substring(38)}
                </Link>
              </p>
              <p>Issued: {cert.timestamp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IssuerDashboard;
