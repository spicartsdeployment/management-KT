import React from 'react';

/**
 * ProtectedRoute is disabled for the requested direct dashboard flow.
 * The app should render the requested management route without
 * consulting Redux auth status or any allowedRoles gate.
 */
const ProtectedRoute = ({ children }) => {
	return children;
};

export default ProtectedRoute;