import React, { useState } from 'react';
import ChatContainer from '../../features/communication/ChatContainer';
import PageLoader from '../../components/PageLoader';
import "../../assets/scss/CommunicationHub.scss";
import "../../assets/scss/Communication.scss";

/**
 * CommunicationHub page component
 * @returns {JSX.Element} Communication hub UI with full chat functionality
 */
const CommunicationHub = () => {
  const [isPageLoading, setIsPageLoading] = useState(false);
  
  return (
    <div className="sch-comm-hub-container" data-testid="school-container-communication-hub">
     
      {isPageLoading ? (
        <PageLoader 
          title="Loading Messages" 
          subtitle="Connecting to communication hub..." 
          icon="💬" 
        />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default CommunicationHub;

