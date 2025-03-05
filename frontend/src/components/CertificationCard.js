import React from 'react';

function CertificationCard({ certification }) {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <div className="certification-card">
            <h4>Certificate #{certification.id}</h4>
            <p>Skill: {certification.skill}</p>
            <p>Level: {certification.level}</p>
            <small data-tooltip="Click to see more details">Hover to flip</small>
          </div>
        </div>
        <div className="flip-card-back">
          <div className="certification-card">
            <p>Issuer: {certification.issuer.substring(0, 6)}...{certification.issuer.substring(38)}</p>
            <p>Issued: {certification.timestamp}</p>
            <div className="progress-bar"></div>
            <button className="ripple">Verify</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificationCard;
