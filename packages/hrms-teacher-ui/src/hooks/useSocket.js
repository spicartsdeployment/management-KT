import { useState, useEffect } from 'react';
import socketService from '../services/socket';

export const useSocket = (event, callback) => {
  useEffect(() => {
    const socket = socketService.connect();

    if (event && callback) {
      socket.on(event, callback);
    }

    return () => {
      if (event && callback) {
        socket.off(event, callback);
      }
    };
  }, [event, callback]);

  return {
    emit: socketService.emit.bind(socketService),
    socket: socketService.socket,
  };
};

export default useSocket;
