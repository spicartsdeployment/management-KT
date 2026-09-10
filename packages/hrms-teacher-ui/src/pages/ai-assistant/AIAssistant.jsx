import React, { useState, useRef, useEffect } from 'react';
import FloatingAIAssistant from '../../components/FloatingAIAssistant';
import '../../assets/scss/AIAssistant.scss';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: "Hello Mr. Sharma! ?? I'm your AI teaching assistant. I can help you with performance insights, attendance tracking, and much more. What would you like to know?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef(null);

  const insightCards = [
    {
      id: 1,
      title: 'Class 9A Performance Increased',
      description: 'Average grade improved by 12% this week',
      type: 'positive',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
          <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
      )
    },
    {
      id: 2,
      title: 'Attendance Dropped in Class 10B',
      description: 'Only 78% attendance today vs 86% average',
      type: 'alert',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
          <polyline points="17 18 23 18 23 12"></polyline>
        </svg>
      )
    },
    {
      id: 3,
      title: 'Chapter 5 Performance Decreased',
      description: 'Students struggling with Quadratic Equations',
      type: 'warning',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      )
    },
    {
      id: 4,
      title: 'High Engagement in Class 11A',
      description: '94% assignment submission rate this month',
      type: 'info',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      )
    }
  ];

  const quickQueries = [
    'Show me top performing students in Class 9A',
    'What\'s the attendance trend this week?',
    'Which topics need more focus?',
    'Generate weekly performance report',
    'Show students who need attention',
    'Compare class performance'
  ];

  const generateReports = [
    { 
      id: 1, 
      title: 'Weekly Performance Report',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      )
    },
    { 
      id: 2, 
      title: 'Attendance Summary',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      )
    },
    { 
      id: 3, 
      title: 'Student Progress Report',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      )
    }
  ];

  const aiInsights = [
    { label: 'Queries Answered', value: '247' },
    { label: 'Reports Generated', value: '18' },
    { label: 'Insights Provided', value: '45' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'ai-smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        text: inputValue
      };
      setMessages([...messages, newMessage]);
      setInputValue('');

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          type: 'assistant',
          text: 'I understand your query. Let me analyze the data and provide you with insights...'
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleQuickQuery = (query) => {
    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      text: query
    };
    setMessages([...messages, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'assistant',
        text: `Processing your request: "${query}". Here are the insights...`
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="ai-hsu-teach-aiassistant" data-testid="teacher-page-ai-assistant">
      {/* Header */}
      <div className="ai-hsu-teach-aiassistant__header">
        <div className="ai-hsu-teach-aiassistant__header-content">
          <h1 className="ai-hsu-teach-aiassistant__title">AI Assistant</h1>
          <p className="ai-hsu-teach-aiassistant__subtitle">
            Get smart insights and teaching recommendations
          </p>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="ai-hsu-teach-aiassistant__insights">
        {insightCards.map((card) => (
          <div
            key={card.id}
            className={`ai-hsu-teach-aiassistant__insight-card ai-hsu-teach-aiassistant__insight-card--${card.type}`}
            data-testid={`teacher-card-insight-${card.id}`}
          >
            <div className="ai-hsu-teach-aiassistant__insight-icon">{card.icon}</div>
            <div className="ai-hsu-teach-aiassistant__insight-content">
              <h3 className="ai-hsu-teach-aiassistant__insight-title">{card.title}</h3>
              <p className="ai-hsu-teach-aiassistant__insight-desc">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="ai-hsu-teach-aiassistant__main">
        {/* Chat Section */}
        <div className="ai-hsu-teach-aiassistant__chat-section">
          <div className="ai-hsu-teach-aiassistant__chat-header">
            <div className="ai-hsu-teach-aiassistant__chat-header-icon">?</div>
            <h2 className="ai-hsu-teach-aiassistant__chat-header-title">AI Chat Assistant</h2>
          </div>

          <div className="ai-hsu-teach-aiassistant__chat-messages" data-testid="teacher-section-chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`ai-hsu-teach-aiassistant__message ai-hsu-teach-aiassistant__message--${message.type}`}
                data-testid={`teacher-message-${message.type}-${message.id}`}
              >
                <div className="ai-hsu-teach-aiassistant__message-bubble">
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-hsu-teach-aiassistant__chat-input-wrapper">
            <input
              type="text"
              className="ai-hsu-teach-aiassistant__chat-input"
              placeholder="Ask me anything about your classes..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              data-testid="teacher-input-chat-message"
            />
            <button
              className="ai-hsu-teach-aiassistant__chat-send-btn"
              onClick={handleSendMessage}
              data-testid="teacher-button-send-message"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 10L18 2L10 18L8 11L2 10Z" fill="currentColor" />
              </svg>
            </button>
            <button
              className="ai-hsu-teach-aiassistant__chat-voice-btn"
              data-testid="teacher-button-voice-input"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C8.34 2 7 3.34 7 5V10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10V5C13 3.34 11.66 2 10 2Z" fill="currentColor" />
                <path d="M16 10C16 13.31 13.31 16 10 16C6.69 16 4 13.31 4 10" stroke="currentColor" strokeWidth="2" />
                <path d="M10 16V19M7 19H13" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="ai-hsu-teach-aiassistant__sidebar">
          {/* Quick Queries */}
          <div className="ai-hsu-teach-aiassistant__sidebar-section">
            <h3 className="ai-hsu-teach-aiassistant__sidebar-title">Quick Queries</h3>
            <div className="ai-hsu-teach-aiassistant__quick-queries">
              {quickQueries.map((query, index) => (
                <button
                  key={index}
                  className="ai-hsu-teach-aiassistant__quick-query-btn"
                  onClick={() => handleQuickQuery(query)}
                  data-testid={`teacher-button-quick-query-${index}`}
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Reports */}
          <div className="ai-hsu-teach-aiassistant__sidebar-section">
            <h3 className="ai-hsu-teach-aiassistant__sidebar-title">Generate Reports</h3>
            <div className="ai-hsu-teach-aiassistant__reports">
              {generateReports.map((report) => (
                <button
                  key={report.id}
                  className="ai-hsu-teach-aiassistant__report-btn"
                  data-testid={`teacher-button-report-${report.id}`}
                >
                  <span className="ai-hsu-teach-aiassistant__report-icon">{report.icon}</span>
                  <span className="ai-hsu-teach-aiassistant__report-title">{report.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Insights Stats */}
          <div className="ai-hsu-teach-aiassistant__sidebar-section">
            <h3 className="ai-hsu-teach-aiassistant__sidebar-title">AI Insights</h3>
            <div className="ai-hsu-teach-aiassistant__insights-stats">
              {aiInsights.map((insight, index) => (
                <div key={index} className="ai-hsu-teach-aiassistant__insight-stat" data-testid={`teacher-stat-insight-${index}`}>
                  <div className="ai-hsu-teach-aiassistant__insight-stat-label">{insight.label}</div>
                  <div className="ai-hsu-teach-aiassistant__insight-stat-value">{insight.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Button */}
      <button
        className="ai-hsu-teach-aiassistant__floating-btn"
        onClick={() => setShowChat(!showChat)}
        data-testid="teacher-button-floating-ai"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" />
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
    </div>
  );
};

export default AIAssistant;
