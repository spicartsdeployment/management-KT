import React, { useState, useRef, useEffect } from 'react';
import '../assets/scss/FloatingAIAssistant.scss';

const FloatingAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: "Hello Mr. Sharma! 👋 I'm your AI assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAutoReply = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('hey')) {
      return "Hello! I'm here to assist you with your classes. I can help you with attendance tracking, performance insights, or scheduling. What would you like to focus on?";
    }
    
    if (lowerMsg.includes('help')) {
      return "I understand your query. Based on your classes, I can help you with attendance tracking, performance insights, or scheduling. What would you like to focus on?";
    }
    
    if (lowerMsg.includes('attendance')) {
      return "I can help you track attendance. Would you like to see today's attendance summary, attendance trends, or manage student absences?";
    }
    
    if (lowerMsg.includes('performance') || lowerMsg.includes('grades')) {
      return "I can provide performance insights. Would you like to see class performance trends, top performers, or students who need attention?";
    }
    
    if (lowerMsg.includes('schedule') || lowerMsg.includes('meeting')) {
      return "I can help with scheduling. Would you like to view upcoming meetings, schedule a parent-teacher conference, or check your class timetable?";
    }
    
    if (lowerMsg.includes('thank') || lowerMsg.includes('thanks')) {
      return "You're welcome! Feel free to ask if you need anything else. I'm here to help! 😊";
    }
    
    return "I understand your query. Based on your classes, I can help you with attendance tracking, performance insights, or scheduling. What would you like to focus on?";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const assistantMessage = {
        id: messages.length + 2,
        type: 'assistant',
        text: getAutoReply(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickReply = (reply) => {
    setInputValue(reply);
  };

  const quickReplies = [
    "Show attendance",
    "Performance report",
    "Schedule meeting",
    "Student alerts"
  ];

  return (
    <>
      {/* Floating Button */}
      <button 
        className={`floating-ai-button ${isOpen ? 'floating-ai-button--active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        data-testid="common-button-ai-assistant"
        aria-label="AI Assistant"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
          </svg>
        )}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="floating-ai-modal" data-testid="common-modal-ai-assistant">
          <div className="floating-ai-modal__header">
            <div className="floating-ai-modal__header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="floating-ai-modal__header-content">
              <h3 className="floating-ai-modal__title">AI Assistant</h3>
              <p className="floating-ai-modal__subtitle">Ask me anything about your classes</p>
            </div>
          </div>

          <div className="floating-ai-modal__messages" data-testid="common-container-chat-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`floating-ai-message floating-ai-message--${message.type}`}
                data-testid={`common-message-${message.type}`}
              >
                {message.type === 'assistant' && (
                  <div className="floating-ai-message__avatar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                    </svg>
                  </div>
                )}
                <div className="floating-ai-message__content">
                  <p className="floating-ai-message__text">{message.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="floating-ai-message floating-ai-message--assistant">
                <div className="floating-ai-message__avatar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="floating-ai-message__content">
                  <div className="floating-ai-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="floating-ai-modal__quick-replies">
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  className="floating-ai-quick-reply"
                  onClick={() => handleQuickReply(reply)}
                  data-testid={`common-button-quick-reply-${idx}`}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          <div className="floating-ai-modal__input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="floating-ai-input"
              data-testid="common-input-chat-message"
            />
            <button 
              className="floating-ai-send-button"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              data-testid="common-button-send-message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor"></polygon>
              </svg>
            </button>
            <button 
              className="floating-ai-voice-button"
              data-testid="common-button-voice-input"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAIAssistant;
