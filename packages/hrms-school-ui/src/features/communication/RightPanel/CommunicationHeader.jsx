import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import '../../../assets/scss/Communication.scss';

/**
 * CommunicationHeader - Static header for contacts panel
 */
const CommunicationHeader = () => {
  return (
    <div className="comm-header">
      <div className="comm-header-title">Communication</div>
      {/* <button className="comm-header-btn" data-testid="school-button-new-chat">
        <PlusIcon className="comm-header-icon" />
      </button> */}
    </div>
  );
};

export default CommunicationHeader;
