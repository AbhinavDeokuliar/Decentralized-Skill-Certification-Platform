import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation({ isIssuer }) {
  const location = useLocation();
  const isActive = path => location.pathname === path ? 'active' : '';

  return (
    <nav className="navigation">
      <Link className={isActive('/')} to="/">Dashboard</Link>
      {isIssuer ? (
        <>
          <Link className={isActive('/issue')} to="/issue">Issue Certificate</Link>
          <Link className={isActive('/issuer-dashboard')} to="/issuer-dashboard">Issued Certificates</Link>
        </>
      ) : (
        <>
          <Link className={isActive('/my-certifications')} to="/my-certifications">My Certificates</Link>
          <Link className={isActive('/verify')} to="/verify">Verify Certificate</Link>
        </>
      )}
      <Link className={isActive('/lookup')} to="/lookup">Look Up Certificates</Link>
    </nav>
  );
}

export default Navigation;
