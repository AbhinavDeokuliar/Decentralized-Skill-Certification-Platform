import React from 'react';
import { Navigate } from 'react-router-dom';

const IssuerRoute = ({ children, isIssuer }) => {
  if (!isIssuer) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default IssuerRoute;
