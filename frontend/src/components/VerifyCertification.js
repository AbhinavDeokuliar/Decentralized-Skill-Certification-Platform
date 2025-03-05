import React, { useState } from 'react';
import { motion } from 'framer-motion';

function VerifyCertification({ contract }) {
  const [certificationId, setCertificationId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [certDetails, setCertDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Verify the certification
      const isValid = await contract.verifyCertification(certificationId);
      setVerificationResult(isValid);

      if (isValid) {
        // Get certification details
        const details = await contract.getCertificationById(certificationId);
        setCertDetails({
          id: details.id.toString(),
          skill: details.skill,
          level: details.level,
          issuer: details.issuer,
          recipient: details.recipient,
          timestamp: new Date(details.timestamp * 1000).toLocaleString()
        });
      } else {
        setCertDetails(null);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult(false);
      setCertDetails(null);
    }
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="verify-certification"
    >
      <h2>Verify Certificate</h2>
      <div className="verification-container">
        <form onSubmit={handleVerify} className="verification-form">
          <div className="input-group">
            <input
              type="number"
              value={certificationId}
              onChange={(e) => setCertificationId(e.target.value)}
              placeholder="Enter Certificate ID"
              required
            />
            <button type="submit" className="verify-button ripple" disabled={loading}>
              {loading ? (
                <div className="loading-spinner-small"></div>
              ) : (
                'Verify Certificate'
              )}
            </button>
          </div>
        </form>

        {verificationResult !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`verification-result ${verificationResult ? 'valid' : 'invalid'}`}
          >
            <h3>
              {verificationResult ? (
                <span className="valid-text">✓ Valid Certificate</span>
              ) : (
                <span className="invalid-text">✗ Invalid Certificate</span>
              )}
            </h3>
            
            {certDetails && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="certificate-details"
              >
                <h4>Certificate Details</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Certificate ID:</label>
                    <span>{certDetails.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>Skill:</label>
                    <span>{certDetails.skill}</span>
                  </div>
                  <div className="detail-item">
                    <label>Level:</label>
                    <span>{certDetails.level}</span>
                  </div>
                  <div className="detail-item">
                    <label>Issuer:</label>
                    <span className="address">{certDetails.issuer}</span>
                  </div>
                  <div className="detail-item">
                    <label>Recipient:</label>
                    <span className="address">{certDetails.recipient}</span>
                  </div>
                  <div className="detail-item">
                    <label>Issue Date:</label>
                    <span>{certDetails.timestamp}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default VerifyCertification;
