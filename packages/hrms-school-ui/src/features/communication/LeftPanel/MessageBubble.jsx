import React from 'react';
import PropTypes from 'prop-types';
import '../../../assets/scss/Communication.scss';

/**
 * MessageBubble - Displays message with time/ticks outside the bubble
 */
const MessageBubble = ({ msg, highlight }) => {
  const bubbleClass = `message-bubble ${msg.sender === 'me' ? 'message-bubble--sent' : 'message-bubble--received'} ${highlight ? 'message-bubble--highlight' : ''}`;

  return (
    <div className="message-wrapper">
      <div className={bubbleClass} data-testid="school-bubble-message">
        <div className="message-bubble__text">
          {msg.text}
        </div>
      </div>
      <div className={`message-bubble__meta message-bubble__meta--${msg.sender === 'me' ? 'sent' : 'received'}`}>
        <span className="message-bubble__time">{msg.time}</span>
        {msg.sender === 'me' && (
          <span className="message-bubble__status">
            {msg.seen ? (
              <span className="message-bubble__tick message-bubble__tick--seen">✓✓</span>
            ) : msg.delivered ? (
              <span className="message-bubble__tick message-bubble__tick--delivered">✓✓</span>
            ) : (
              <span className="message-bubble__tick message-bubble__tick--sent">✓</span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

MessageBubble.propTypes = {
  msg: PropTypes.shape({
    sender: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    seen: PropTypes.bool,
    delivered: PropTypes.bool,
  }).isRequired,
  highlight: PropTypes.bool,
};

export default MessageBubble;