import { useEffect, useRef, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { updateBusLocation, addNotification } from '../../packages/hrms-school-ui/src/schoolSlice'

export const useSocket = (url = null, options = {}) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = options.maxReconnectAttempts || 5
  const reconnectInterval = options.reconnectInterval || 3000

  const connect = useCallback(() => {
    if (!url) return

    try {
      // In a real app, this would be a WebSocket connection
      // For demo purposes, we'll simulate socket events
      const mockSocket = {
        send: (data) => {
          console.log('Mock socket send:', data)
        },
        close: () => {
          console.log('Mock socket closed')
          setIsConnected(false)
        },
        addEventListener: (event, handler) => {
          console.log('Mock socket listener added:', event)
        },
        removeEventListener: (event, handler) => {
          console.log('Mock socket listener removed:', event)
        }
      }

      setSocket(mockSocket)
      setIsConnected(true)
      setError(null)
      reconnectAttempts.current = 0

      // Simulate receiving bus location updates
      const busLocationInterval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance of update
          dispatch(updateBusLocation({
            lat: 40.7128 + (Math.random() - 0.5) * 0.01,
            lng: -74.0060 + (Math.random() - 0.5) * 0.01,
            address: 'Updated location',
            timestamp: Date.now()
          }))
        }
      }, 5000)

      // Simulate receiving notifications
      const notificationInterval = setInterval(() => {
        if (Math.random() > 0.9) { // 10% chance of notification
          dispatch(addNotification({
            id: Date.now(),
            type: 'info',
            title: 'Live Update',
            message: 'New activity in your dashboard',
            timestamp: Date.now(),
            read: false
          }))
        }
      }, 10000)

      // Cleanup function
      mockSocket.cleanup = () => {
        clearInterval(busLocationInterval)
        clearInterval(notificationInterval)
      }

    } catch (err) {
      setError(err.message)
      setIsConnected(false)
      
      // Attempt to reconnect
      if (reconnectAttempts.current < maxReconnectAttempts) {
        setTimeout(() => {
          reconnectAttempts.current++
          connect()
        }, reconnectInterval)
      }
    }
  }, [url, dispatch, maxReconnectAttempts, reconnectInterval])

  const disconnect = useCallback(() => {
    if (socket) {
      if (socket.cleanup) {
        socket.cleanup()
      }
      socket.close()
      setSocket(null)
      setIsConnected(false)
    }
  }, [socket])

  const sendMessage = useCallback((message) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message))
    } else {
      console.warn('Socket not connected')
    }
  }, [socket, isConnected])

  // Connect on mount if URL is provided
  useEffect(() => {
    if (url) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [url, connect, disconnect])

  return {
    socket,
    isConnected,
    error,
    connect,
    disconnect,
    sendMessage,
    reconnectAttempts: reconnectAttempts.current,
  }
}

// Hook specifically for bus tracking
export const useBusTracking = () => {
  return useSocket('/ws/bus-tracking', {
    maxReconnectAttempts: 10,
    reconnectInterval: 2000,
  })
}

// Hook for general notifications
export const useNotifications = () => {
  return useSocket('/ws/notifications', {
    maxReconnectAttempts: 5,
    reconnectInterval: 5000,
  })
}