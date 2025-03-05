import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Dashboard({ contract, account, isIssuer }) {
  const [stats, setStats] = useState({
    totalIssued: 0,
    totalReceived: 0,
    recentCertifications: [],
    recentlyIssuedCerts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const issued = await contract.getCertificationsByIssuer(account);
        const received = await contract.getCertificationsByRecipient(account);
        
        let recentCerts = [];
        let recentlyIssuedCerts = [];

        if (!isIssuer) {
          recentCerts = await Promise.all(
            received.slice(-3).map(async (id) => {
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
        } else {
          recentlyIssuedCerts = await Promise.all(
            issued.slice(-3).map(async (id) => {
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
        }

        setStats({
          totalIssued: issued.length,
          totalReceived: received.length,
          recentCertifications: recentCerts,
          recentlyIssuedCerts: recentlyIssuedCerts
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
        setLoading(false);
      }
    };

    if (contract && account) {
      loadStats();
    }
  }, [contract, account, isIssuer]);

  const IssuerDashboard = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="issuer-dashboard-content"
    >
      <div className="dashboard-header">
        <h2>Issuer Dashboard</h2>
        <div className="quick-actions">
          <Link to="/issue" className="action-button primary">Issue New Certificate</Link>
          <Link to="/issuer-dashboard" className="action-button secondary">View All Certificates</Link>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card highlighted">
          <h3>Total Certificates Issued</h3>
          <div className="stat-value">{stats.totalIssued}</div>
        </div>

        <div className="recent-activity">
          <h3>Recently Issued Certificates</h3>
          <div className="recent-certs-grid">
            {stats.recentlyIssuedCerts.map((cert) => (
              <div key={cert.id} className="recent-cert-card">
                <h4>Certificate #{cert.id}</h4>
                <p className="cert-skill">{cert.skill} - {cert.level}</p>
                <p className="cert-recipient">
                  To: {cert.recipient.substring(0, 6)}...{cert.recipient.substring(38)}
                </p>
                <p className="cert-date">{cert.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const RecipientDashboard = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="recipient-dashboard-content"
    >
      <div className="dashboard-header">
        <h2>Your Certificates</h2>
        <div className="quick-actions">
          <Link to="/my-certifications" className="action-button primary">View All Certificates</Link>
          <Link to="/verify" className="action-button secondary">Verify a Certificate</Link>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card highlighted">
          <h3>Total Certificates Received</h3>
          <div className="stat-value">{stats.totalReceived}</div>
        </div>

        <div className="recent-activity">
          <h3>Recent Certifications</h3>
          <div className="recent-certs-grid">
            {stats.recentCertifications.map((cert) => (
              <div key={cert.id} className="recent-cert-card">
                <h4>{cert.skill}</h4>
                <p className="cert-level">{cert.level}</p>
                <p className="cert-issuer">
                  From: {cert.issuer.substring(0, 6)}...{cert.issuer.substring(38)}
                </p>
                <p className="cert-date">{cert.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) return <div className="loading-spinner" />;

  return (
    <div className="dashboard">
      {isIssuer ? <IssuerDashboard /> : <RecipientDashboard />}
    </div>
  );
}

export default Dashboard;
