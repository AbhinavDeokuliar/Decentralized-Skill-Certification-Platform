import React, { useState, useEffect } from 'react';

function CertificationList({ contract, account }) {
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    const loadCertifications = async () => {
      try {
        const recipientCerts = await contract.getCertificationsByRecipient(account);
        const certsDetails = await Promise.all(
          recipientCerts.map(async (id) => {
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
        setCertifications(certsDetails);
      } catch (error) {
        console.error('Error loading certifications:', error);
      }
    };

    if (contract && account) {
      loadCertifications();
    }
  }, [contract, account]);

  return (
    <div className="certification-list">
      <h2>Your Certifications</h2>
      <div className="certifications">
        {certifications.map((cert) => (
          <div key={cert.id} className="certification-card">
            <h3>{cert.skill}</h3>
            <p>Level: {cert.level}</p>
            <p>Issuer: {cert.issuer.substring(0, 6)}...{cert.issuer.substring(38)}</p>
            <p>Issued: {cert.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CertificationList;
