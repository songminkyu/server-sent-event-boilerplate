import React, { useState, useEffect, useCallback } from 'react';
import { useSSE } from '../hooks/useSSE';
import { apiService, auth } from '../services/api';
import type { NotificationEvent, RealtimeEvent, ChatMessage, SystemStatus } from '../types/sse.types';
import './SSEDemo.css';

export const SSEDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'realtime' | 'chat' | 'system'>('notifications');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('general');

  // SSE connections for different endpoints
  const notifications = useSSE({
    endpoint: '/notifications/stream',
    token: auth.getToken() || undefined,
    onConnect: () => console.log('Notifications connected'),
    onDisconnect: () => console.log('Notifications disconnected'),
  });

  const realtime = useSSE({
    endpoint: '/realtime/stream',
    token: auth.getToken() || undefined,
    onConnect: () => console.log('Realtime connected'),
    onDisconnect: () => console.log('Realtime disconnected'),
  });

  const chat = useSSE({
    endpoint: `/chat/stream?roomId=${currentRoom}`,
    token: auth.getToken() || undefined,
    onConnect: () => console.log(`Chat connected to ${currentRoom}`),
    onDisconnect: () => console.log(`Chat disconnected from ${currentRoom}`),
  });

  const system = useSSE({
    endpoint: '/system/status/stream',
    onConnect: () => console.log('System status connected'),
    onDisconnect: () => console.log('System status disconnected'),
  });

  useEffect(() => {
    const token = auth.getToken();
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    auth.setDemoToken();
    setIsAuthenticated(true);
    // Reconnect SSE connections with token
    notifications.connect();
    realtime.connect();
    chat.connect();
  };

  const handleLogout = () => {
    auth.clearToken();
    setIsAuthenticated(false);
    notifications.disconnect();
    realtime.disconnect();
    chat.disconnect();
  };

  const sendNotification = async () => {
    try {
      await apiService.sendNotification({
        title: 'Test Notification',
        message: `This is a test notification sent at ${new Date().toLocaleTimeString()}`,
        type: 'info',
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const sendRealtimeUpdate = async () => {
    try {
      await apiService.sendRealtimeUpdate({
        entityType: 'user',
        entityId: 'user123',
        action: 'updated',
        data: { lastSeen: new Date().toISOString() },
      });
    } catch (error) {
      console.error('Failed to send realtime update:', error);
    }
  };

  const sendChatMessage = useCallback(async (message: string) => {
    console.log('Sending chat message:', { roomId: currentRoom, message });
    
    try {
      const response = await apiService.sendChatMessage({
        roomId: currentRoom,
        message,
      });
      
      console.log('Chat message sent successfully:', response.data);
    } catch (error: any) {
      console.error('Failed to send chat message:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Show user-friendly error message
      alert(`Failed to send message: ${error.response?.data?.message || error.message}`);
    }
  }, [currentRoom]);

  const getLatestEvents = (type: string) => {
    console.log(`Getting events for type: ${type}`);
    
    switch (type) {
      case 'notifications':
        const notificationEvents = notifications.events.filter(e => e.type === 'notification').slice(-10);
        console.log('Notification events:', notificationEvents);
        return notificationEvents;
      case 'realtime':
        const realtimeEvents = realtime.events.filter(e => e.type === 'realtime').slice(-10);
        console.log('Realtime events:', realtimeEvents);
        return realtimeEvents;
      case 'chat':
        const chatEvents = chat.events.filter(e => e.type === 'chat' || e.type === 'chat-message').slice(-10);
        console.log('Chat events:', chatEvents);
        console.log('All chat events from hook:', chat.events);
        return chatEvents;
      case 'system':
        const systemEvents = system.events.filter(e => e.type === 'system').slice(-10);
        console.log('System events:', systemEvents);
        return systemEvents;
      default:
        return [];
    }
  };

  const renderConnectionStatus = (connectionName: string, isConnected: boolean, stats: any) => (
    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
      <span className="status-dot"></span>
      {connectionName}: {isConnected ? 'Connected' : 'Disconnected'}
      <small>Events: {stats.totalEvents}, Errors: {stats.errorCount}</small>
    </div>
  );

  return (
    <div className="sse-demo">
      <header className="header">
        <h1>SSE Demo - Real-time Communication</h1>
        <div className="auth-section">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          ) : (
            <button onClick={handleLogin} className="btn btn-primary">
              Login (Demo)
            </button>
          )}
        </div>
      </header>

      <div className="connection-panel">
        <h3>Connection Status</h3>
        <div className="connections-grid">
          {renderConnectionStatus('Notifications', notifications.isConnected, notifications.stats)}
          {renderConnectionStatus('Real-time', realtime.isConnected, realtime.stats)}
          {renderConnectionStatus('Chat', chat.isConnected, chat.stats)}
          {renderConnectionStatus('System', system.isConnected, system.stats)}
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button
          className={`tab ${activeTab === 'realtime' ? 'active' : ''}`}
          onClick={() => setActiveTab('realtime')}
        >
          Real-time Updates
        </button>
        <button
          className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button
          className={`tab ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          System Status
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'notifications' && (
          <NotificationsPanel
            events={getLatestEvents('notifications')}
            onSendNotification={sendNotification}
            isAuthenticated={isAuthenticated}
          />
        )}

        {activeTab === 'realtime' && (
          <RealtimePanel
            events={getLatestEvents('realtime')}
            onSendUpdate={sendRealtimeUpdate}
            isAuthenticated={isAuthenticated}
          />
        )}

        {activeTab === 'chat' && (
          <ChatPanel
            events={getLatestEvents('chat')}
            onSendMessage={sendChatMessage}
            currentRoom={currentRoom}
            onRoomChange={setCurrentRoom}
            isAuthenticated={isAuthenticated}
          />
        )}

        {activeTab === 'system' && (
          <SystemPanel events={getLatestEvents('system')} />
        )}
      </div>
    </div>
  );
};

// Notifications Panel Component
const NotificationsPanel: React.FC<{
  events: any[];
  onSendNotification: () => void;
  isAuthenticated: boolean;
}> = ({ events, onSendNotification, isAuthenticated }) => (
  <div className="panel">
    <div className="panel-header">
      <h3>Push Notifications</h3>
      <button
        onClick={onSendNotification}
        disabled={!isAuthenticated}
        className="btn btn-primary"
      >
        Send Test Notification
      </button>
    </div>
    <div className="events-list">
      {events.length === 0 ? (
        <div className="no-events">No notifications received yet</div>
      ) : (
        events.map((event, index) => {
          const notification = event.data as NotificationEvent;
          return (
            <div key={index} className={`event notification-${notification.type}`}>
              <div className="event-header">
                <strong>{notification.title}</strong>
                <span className="timestamp">{new Date(event.timestamp).toLocaleTimeString()}</span>
              </div>
              <p>{notification.message}</p>
            </div>
          );
        })
      )}
    </div>
  </div>
);

// Real-time Panel Component
const RealtimePanel: React.FC<{
  events: any[];
  onSendUpdate: () => void;
  isAuthenticated: boolean;
}> = ({ events, onSendUpdate, isAuthenticated }) => (
  <div className="panel">
    <div className="panel-header">
      <h3>Real-time Updates</h3>
      <button
        onClick={onSendUpdate}
        disabled={!isAuthenticated}
        className="btn btn-primary"
      >
        Send Test Update
      </button>
    </div>
    <div className="events-list">
      {events.length === 0 ? (
        <div className="no-events">No real-time updates received yet</div>
      ) : (
        events.map((event, index) => {
          const update = event.data as RealtimeEvent;
          return (
            <div key={index} className="event realtime-event">
              <div className="event-header">
                <strong>{update.entityType} {update.action}</strong>
                <span className="timestamp">{new Date(event.timestamp).toLocaleTimeString()}</span>
              </div>
              <p>Entity ID: {update.entityId}</p>
              <pre>{JSON.stringify(update.data, null, 2)}</pre>
            </div>
          );
        })
      )}
    </div>
  </div>
);

// Chat Panel Component
const ChatPanel: React.FC<{
  events: any[];
  onSendMessage: (message: string) => void;
  currentRoom: string;
  onRoomChange: (room: string) => void;
  isAuthenticated: boolean;
}> = ({ events, onSendMessage, currentRoom, onRoomChange, isAuthenticated }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = useCallback(() => {
    const trimmedMessage = message.trim();
    
    // Validation
    if (!trimmedMessage) {
      alert('Please enter a message');
      return;
    }
    
    if (trimmedMessage.length > 500) {
      alert('Message is too long (max 500 characters)');
      return;
    }
    
    if (!isAuthenticated) {
      alert('Please log in to send messages');
      return;
    }
    
    onSendMessage(trimmedMessage);
    setMessage('');
  }, [message, onSendMessage, isAuthenticated]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Chat - Room: {currentRoom}</h3>
        <select
          value={currentRoom}
          onChange={(e) => onRoomChange(e.target.value)}
          className="room-select"
        >
          <option value="general">General</option>
          <option value="tech">Tech</option>
          <option value="random">Random</option>
        </select>
      </div>
      
      <div className="chat-messages">
        {events.length === 0 ? (
          <div className="no-events">No chat messages yet</div>
        ) : (
          events.map((event, index) => {
            const chat = event.data as ChatMessage;
            return (
              <div key={index} className={`chat-message ${chat.type || 'normal'}`}>
                <span className="username">{chat.username}:</span>
                <span className="message">{chat.message}</span>
                <span className="timestamp">{new Date(event.timestamp).toLocaleTimeString()}</span>
              </div>
            );
          })
        )}
      </div>

      <div className="chat-input" style={{ display: 'flex', gap: '8px', padding: '10px', alignItems: 'flex-start' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={!isAuthenticated}
            onKeyDown={handleKeyDown}
            maxLength={500}
            style={{ 
              width: '100%', 
              paddingRight: '60px',
              paddingLeft: '12px',
              paddingTop: '8px',
              paddingBottom: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <span 
            style={{ 
              position: 'absolute', 
              right: '10px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              fontSize: '11px',
              color: message.length > 450 ? '#ff0000' : '#888',
              pointerEvents: 'none',
              fontWeight: 'bold'
            }}
          >
            {message.length}/500
          </span>
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!isAuthenticated || !message.trim()}
          className="btn btn-primary"
          style={{
            padding: '8px 16px',
            minWidth: '60px',
            flexShrink: 0,
            height: '36px'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

// System Panel Component
const SystemPanel: React.FC<{ events: any[] }> = ({ events }) => (
  <div className="panel">
    <div className="panel-header">
      <h3>System Status</h3>
    </div>
    <div className="events-list">
      {events.length === 0 ? (
        <div className="no-events">No system status updates yet</div>
      ) : (
        events.map((event, index) => {
          const status = event.data as SystemStatus;
          return (
            <div key={index} className="event system-status">
              <div className="event-header">
                <strong>System Status: {status.status}</strong>
                <span className="timestamp">{new Date(event.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="status-details">
                <p>Uptime: {Math.floor(status.uptime / 1000)}s</p>
                <p>Active Connections: {status.connections}</p>
                <p>Memory: {Math.round(status.memoryUsage.used / 1024 / 1024)}MB / {Math.round(status.memoryUsage.total / 1024 / 1024)}MB</p>
                <p>CPU Usage: {status.cpuUsage.toFixed(1)}%</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
);