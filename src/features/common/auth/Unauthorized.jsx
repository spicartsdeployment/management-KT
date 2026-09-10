import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import '../../../assets/scss/Unauthorized.scss';

/**
 * Unauthorized - 403 Access Denied page
 * Shown when user tries to access routes they don't have permission for
 */
const Unauthorized = () => {
  const { role, user } = useAuth();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const getRoleName = (role) => {
    const roleNames = {
      parent: 'Parent',
      student: 'Student',
      teacher: 'Teacher',
      admin: 'Administrator',
    };
    return roleNames[role] || role;
  };

  return (
    <div className="unauthorized-page" data-testid="common-page-unauthorized">
      <div className="unauthorized-page__container">
        <div className="unauthorized-page__icon">
          <span className="unauthorized-page__icon-text">🚫</span>
        </div>
        
        <h1 className="unauthorized-page__title">Access Denied</h1>
        
        <p className="unauthorized-page__message">
          You don't have permission to access this page.
        </p>

        {role && (
          <div className="unauthorized-page__info">
            <div className="unauthorized-page__info-item">
              <span className="unauthorized-page__info-label">Your Role:</span>
              <span className="unauthorized-page__info-value">{getRoleName(role)}</span>
            </div>
            {user?.name && (
              <div className="unauthorized-page__info-item">
                <span className="unauthorized-page__info-label">Logged in as:</span>
                <span className="unauthorized-page__info-value">{user.name}</span>
              </div>
            )}
          </div>
        )}

        <div className="unauthorized-page__actions">
          <button 
            onClick={handleGoBack}
            className="unauthorized-page__button unauthorized-page__button--secondary"
            data-testid="common-button-go-back"
          >
            ← Go Back
          </button>
          <Link 
            to="/"
            className="unauthorized-page__button unauthorized-page__button--primary"
            data-testid="common-button-go-home"
          >
            🏠 Go to Dashboard
          </Link>
        </div>

        <p className="unauthorized-page__help">
          If you believe you should have access to this page, please contact your administrator.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
