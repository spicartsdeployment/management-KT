import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * LoginGuard disabled for direct management dashboard navigation.
 * The app now opens on the management dashboard route instead of
 * forcing the login form or any authored auth redirect.
 */
const LoginGuard = () => {
  return <Navigate to="/management/dashboard" replace />;
};

export default LoginGuard;
