// Socket removed: No real-time bus tracking via WebSocket.
// Use REST API polling or other mechanism instead.

const busSocket = {
  on: () => {},
  off: () => {},
  emit: () => {}
};

export default busSocket;
