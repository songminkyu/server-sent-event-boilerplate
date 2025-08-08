import { useEffect, useRef, useState, useCallback } from 'react';
import type { SSEEvent, ConnectionStats } from '../types/sse.types';

export interface SSEOptions {
  endpoint: string;
  token?: string;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (event: Event) => void;
  withCredentials?: boolean;
}

export const useSSE = (options: SSEOptions) => {
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const [stats, setStats] = useState<ConnectionStats>({
    connected: false,
    connectionTime: 0,
    lastEventTime: 0,
    totalEvents: 0,
    errorCount: 0,
    reconnectCount: 0,
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectCountRef = useRef<number>(0);

  const {
    endpoint,
    token,
    reconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    onConnect,
    onDisconnect,
    onError,
    withCredentials = false,
  } = options;

  const buildUrl = useCallback(() => {
    const baseUrl = endpoint.startsWith('http') ? endpoint : `http://localhost:3000${endpoint}`;
    const url = new URL(baseUrl);
    
    if (token) {
      url.searchParams.set('token', token);
    }
    
    console.log('SSE URL:', url.toString());
    return url.toString();
  }, [endpoint, token]);

  const connect = useCallback(() => {
    // Cleanup existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    try {
      const url = buildUrl();
      console.log('Connecting to SSE:', url);
      
      const eventSource = new EventSource(url, { withCredentials });
      eventSourceRef.current = eventSource;

      eventSource.onopen = (event) => {
        console.log('SSE connection opened:', event);
        reconnectCountRef.current = 0; // Reset reconnect count on successful connection
        
        setStats(prev => ({
          ...prev,
          connected: true,
          connectionTime: Date.now(),
          reconnectCount: 0,
        }));
        
        onConnect?.();
      };

      eventSource.onmessage = (event) => {
        console.log('SSE message received:', event);
        
        try {
          const parsedData = JSON.parse(event.data);
          const sseEvent: SSEEvent = {
            id: event.lastEventId || `${Date.now()}-${Math.random()}`,
            type: event.type || 'message',
            data: parsedData,
            timestamp: Date.now(),
          };

          setEvents(prev => [...prev.slice(-50), sseEvent]); // Keep only last 50 events
          setStats(prev => ({
            ...prev,
            lastEventTime: Date.now(),
            totalEvents: prev.totalEvents + 1,
          }));
        } catch (error) {
          console.error('Failed to parse SSE event:', error, event);
          setStats(prev => ({
            ...prev,
            errorCount: prev.errorCount + 1,
          }));
        }
      };

      eventSource.onerror = (event) => {
        console.error('SSE error:', event);
        
        setStats(prev => ({
          ...prev,
          connected: false,
          errorCount: prev.errorCount + 1,
        }));

        onError?.(event);
        onDisconnect?.();

        // Handle reconnection
        if (reconnect && reconnectCountRef.current < maxReconnectAttempts) {
          reconnectCountRef.current += 1;
          
          console.log(`Attempting reconnect ${reconnectCountRef.current}/${maxReconnectAttempts} in ${reconnectInterval}ms`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setStats(prev => ({
              ...prev,
              reconnectCount: reconnectCountRef.current,
            }));
            connect();
          }, reconnectInterval);
        } else {
          console.error('Max reconnection attempts reached');
        }
      };

      // Handle custom event types
      ['notification', 'realtime', 'chat-message', 'system', 'heartbeat'].forEach(eventType => {
        eventSource.addEventListener(eventType, (event: MessageEvent) => {
          console.log(`SSE ${eventType} event:`, event);
          
          try {
            const parsedData = JSON.parse(event.data);
            const sseEvent: SSEEvent = {
              id: event.lastEventId || `${Date.now()}-${Math.random()}`,
              type: eventType,
              data: parsedData,
              timestamp: Date.now(),
            };

            setEvents(prev => [...prev.slice(-50), sseEvent]); // Keep only last 50 events
            setStats(prev => ({
              ...prev,
              lastEventTime: Date.now(),
              totalEvents: prev.totalEvents + 1,
            }));
          } catch (error) {
            console.error(`Failed to parse ${eventType} event:`, error, event);
            setStats(prev => ({
              ...prev,
              errorCount: prev.errorCount + 1,
            }));
          }
        });
      });

    } catch (error) {
      console.error('Failed to create SSE connection:', error);
      setStats(prev => ({
        ...prev,
        connected: false,
        errorCount: prev.errorCount + 1,
      }));
    }
  }, [buildUrl, onConnect, onDisconnect, onError, reconnect, reconnectInterval, maxReconnectAttempts, withCredentials]);

  const disconnect = useCallback(() => {
    console.log('Disconnecting SSE');
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    setStats(prev => ({ ...prev, connected: false }));
    onDisconnect?.();
  }, [onDisconnect]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  // Only connect once when the component mounts or endpoint/token changes
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [endpoint, token]); // Only depend on endpoint and token

  // Manual reconnect function
  const reconnectManually = useCallback(() => {
    reconnectCountRef.current = 0;
    connect();
  }, [connect]);

  return {
    events,
    stats,
    connect: reconnectManually, // Expose manual reconnect
    disconnect,
    clearEvents,
    isConnected: stats.connected,
  };
};