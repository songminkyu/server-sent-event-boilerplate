# Frontend Integration Examples

This document provides examples of how to integrate with the SSE boilerplate from various frontend frameworks.

## Vanilla JavaScript

### Basic SSE Connection
```javascript
// Create connection to notifications stream
const eventSource = new EventSource('/notifications/stream?token=YOUR_AUTH_TOKEN');

// Listen for different event types
eventSource.addEventListener('notification', (event) => {
    const data = JSON.parse(event.data);
    console.log('Notification:', data);
    showNotification(data.title, data.message, data.type);
});

eventSource.addEventListener('heartbeat', (event) => {
    const data = JSON.parse(event.data);
    console.log('Heartbeat:', data.timestamp);
});

// Handle connection events
eventSource.onopen = () => {
    console.log('SSE connection opened');
};

eventSource.onerror = (error) => {
    console.error('SSE connection error:', error);
};

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    eventSource.close();
});
```

### Send Notification
```javascript
async function sendNotification(title, message, type = 'info', targetUserId = null) {
    const response = await fetch('/notifications/send' + (targetUserId ? `?targetUserId=${targetUserId}` : ''), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_AUTH_TOKEN'
        },
        body: JSON.stringify({
            title,
            message,
            type,
            metadata: {
                source: 'frontend'
            }
        })
    });
    
    const result = await response.json();
    console.log('Send result:', result);
}
```

## React Integration

### Custom Hook for SSE
```jsx
import { useState, useEffect, useRef } from 'react';

const useSSE = (endpoint, token, eventTypes = []) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [connectionState, setConnectionState] = useState('connecting');
    const eventSourceRef = useRef(null);

    useEffect(() => {
        if (!endpoint || !token) return;

        const url = `${endpoint}?token=${token}`;
        const eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
            setConnectionState('connected');
            setError(null);
        };

        eventSource.onerror = (event) => {
            setConnectionState('error');
            setError('Connection failed');
        };

        // Listen for specified event types
        eventTypes.forEach(eventType => {
            eventSource.addEventListener(eventType, (event) => {
                const eventData = JSON.parse(event.data);
                setData({
                    type: eventType,
                    data: eventData,
                    timestamp: new Date()
                });
            });
        });

        // Cleanup
        return () => {
            eventSource.close();
        };
    }, [endpoint, token, eventTypes]);

    return { data, error, connectionState };
};

// Usage component
const NotificationComponent = () => {
    const { data, error, connectionState } = useSSE(
        '/notifications/stream',
        'YOUR_AUTH_TOKEN',
        ['notification', 'heartbeat']
    );

    if (error) return <div>Connection Error: {error}</div>;
    if (connectionState === 'connecting') return <div>Connecting...</div>;

    return (
        <div>
            <div>Status: {connectionState}</div>
            {data && (
                <div>
                    <h4>Last Event: {data.type}</h4>
                    <pre>{JSON.stringify(data.data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};
```

### Chat Component Example
```jsx
import React, { useState, useEffect, useRef } from 'react';

const ChatRoom = ({ roomId, token, username }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [connectionState, setConnectionState] = useState('connecting');
    const eventSourceRef = useRef(null);

    useEffect(() => {
        // Connect to room-specific chat stream
        const eventSource = new EventSource(`/chat/room/${roomId}/stream?token=${token}`);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
            setConnectionState('connected');
            // Join the room
            joinRoom();
        };

        eventSource.addEventListener('chat-message', (event) => {
            const message = JSON.parse(event.data);
            setMessages(prev => [...prev, message]);
        });

        eventSource.onerror = () => {
            setConnectionState('error');
        };

        return () => {
            leaveRoom();
            eventSource.close();
        };
    }, [roomId, token]);

    const joinRoom = async () => {
        await fetch(`/chat/room/${roomId}/join`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    };

    const leaveRoom = async () => {
        await fetch(`/chat/room/${roomId}/leave`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        await fetch('/chat/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                roomId,
                message: newMessage,
                type: 'text'
            })
        });

        setNewMessage('');
    };

    return (
        <div className="chat-room">
            <div className="chat-header">
                <h3>Room: {roomId}</h3>
                <span className={`status ${connectionState}`}>{connectionState}</span>
            </div>
            
            <div className="messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.type}`}>
                        <span className="username">{msg.username}</span>
                        <span className="text">{msg.message}</span>
                        <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>

            <form onSubmit={sendMessage} className="message-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    disabled={connectionState !== 'connected'}
                />
                <button type="submit" disabled={connectionState !== 'connected'}>
                    Send
                </button>
            </form>
        </div>
    );
};
```

## Vue.js Integration

### Composition API Example
```vue
<template>
  <div class="sse-component">
    <div class="connection-status" :class="connectionState">
      Status: {{ connectionState }}
    </div>
    
    <div v-if="latestEvent" class="latest-event">
      <h4>Latest Event</h4>
      <pre>{{ JSON.stringify(latestEvent, null, 2) }}</pre>
    </div>

    <div class="notifications">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        :class="`notification ${notification.type}`"
      >
        <h4>{{ notification.title }}</h4>
        <p>{{ notification.message }}</p>
        <small>{{ formatDate(notification.timestamp) }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  endpoint: String,
  token: String,
  eventTypes: {
    type: Array,
    default: () => ['notification']
  }
});

const connectionState = ref('connecting');
const latestEvent = ref(null);
const notifications = ref([]);
let eventSource = null;

const connectSSE = () => {
  const url = `${props.endpoint}?token=${props.token}`;
  eventSource = new EventSource(url);

  eventSource.onopen = () => {
    connectionState.value = 'connected';
  };

  eventSource.onerror = () => {
    connectionState.value = 'error';
  };

  props.eventTypes.forEach(eventType => {
    eventSource.addEventListener(eventType, (event) => {
      const data = JSON.parse(event.data);
      latestEvent.value = { type: eventType, data };
      
      if (eventType === 'notification') {
        notifications.value.unshift(data);
        // Keep only last 10 notifications
        if (notifications.value.length > 10) {
          notifications.value = notifications.value.slice(0, 10);
        }
      }
    });
  });
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

onMounted(() => {
  if (props.endpoint && props.token) {
    connectSSE();
  }
});

onUnmounted(() => {
  if (eventSource) {
    eventSource.close();
  }
});
</script>

<style scoped>
.connection-status {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: bold;
}

.connection-status.connecting {
  background: #ffeaa7;
  color: #2d3436;
}

.connection-status.connected {
  background: #55a3ff;
  color: white;
}

.connection-status.error {
  background: #ff7675;
  color: white;
}

.notification {
  margin: 10px 0;
  padding: 15px;
  border-radius: 5px;
  border-left: 4px solid;
}

.notification.info {
  background: #e3f2fd;
  border-left-color: #2196f3;
}

.notification.success {
  background: #e8f5e8;
  border-left-color: #4caf50;
}

.notification.warning {
  background: #fff8e1;
  border-left-color: #ff9800;
}

.notification.error {
  background: #ffebee;
  border-left-color: #f44336;
}
</style>
```

## Angular Integration

### Service
```typescript
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface SSEEvent {
  type: string;
  data: any;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SSEService {
  private eventSubject = new Subject<SSEEvent>();
  private eventSource: EventSource | null = null;

  connect(endpoint: string, token: string, eventTypes: string[] = []): Observable<SSEEvent> {
    if (this.eventSource) {
      this.disconnect();
    }

    const url = `${endpoint}?token=${token}`;
    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      console.log('SSE connection opened');
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
    };

    eventTypes.forEach(eventType => {
      this.eventSource!.addEventListener(eventType, (event) => {
        const data = JSON.parse(event.data);
        this.eventSubject.next({
          type: eventType,
          data,
          timestamp: new Date()
        });
      });
    });

    return this.eventSubject.asObservable();
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
```

### Component
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SSEService, SSEEvent } from './sse.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  template: `
    <div class="notification-panel">
      <div class="header">
        <h3>Notifications</h3>
        <span [class]="'status ' + connectionStatus">{{ connectionStatus }}</span>
      </div>
      
      <div class="notifications">
        <div 
          *ngFor="let notification of notifications" 
          [class]="'notification ' + notification.type"
        >
          <h4>{{ notification.title }}</h4>
          <p>{{ notification.message }}</p>
          <small>{{ notification.timestamp | date:'medium' }}</small>
        </div>
      </div>
    </div>
  `
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  connectionStatus = 'disconnected';
  private sseSubscription?: Subscription;

  constructor(private sseService: SSEService) {}

  ngOnInit() {
    this.connectionStatus = 'connecting';
    
    this.sseSubscription = this.sseService.connect(
      '/notifications/stream',
      'YOUR_AUTH_TOKEN',
      ['notification', 'heartbeat']
    ).subscribe({
      next: (event: SSEEvent) => {
        this.connectionStatus = 'connected';
        
        if (event.type === 'notification') {
          this.notifications.unshift(event.data);
          // Keep only last 20 notifications
          this.notifications = this.notifications.slice(0, 20);
        }
      },
      error: (error) => {
        this.connectionStatus = 'error';
        console.error('SSE Error:', error);
      }
    });
  }

  ngOnDestroy() {
    if (this.sseSubscription) {
      this.sseSubscription.unsubscribe();
    }
    this.sseService.disconnect();
  }
}
```

## Authentication Helper

### Token Generation (for testing)
```javascript
// Helper function to generate test tokens
function generateTestToken(userId, username, email, roles = ['user']) {
    const tokenData = `${userId}:${username}:${email}:${roles.join(',')}`;
    return btoa(tokenData); // Base64 encode
}

// Usage
const testToken = generateTestToken('123', 'john_doe', 'john@example.com', ['user', 'admin']);
console.log('Test token:', testToken);

// Use in headers
const headers = {
    'Authorization': `Bearer ${testToken}`,
    'Content-Type': 'application/json'
};
```

### Error Handling Best Practices
```javascript
class SSEManager {
    constructor(endpoint, token, options = {}) {
        this.endpoint = endpoint;
        this.token = token;
        this.options = {
            retryDelay: 3000,
            maxRetries: 5,
            ...options
        };
        this.eventSource = null;
        this.retryCount = 0;
        this.listeners = new Map();
    }

    connect() {
        if (this.eventSource) {
            this.disconnect();
        }

        const url = `${this.endpoint}?token=${this.token}`;
        this.eventSource = new EventSource(url);

        this.eventSource.onopen = () => {
            console.log('SSE connected');
            this.retryCount = 0;
            this.emit('connect');
        };

        this.eventSource.onerror = (error) => {
            console.error('SSE error:', error);
            this.emit('error', error);
            
            if (this.retryCount < this.options.maxRetries) {
                setTimeout(() => {
                    this.retryCount++;
                    console.log(`Retrying connection (${this.retryCount}/${this.options.maxRetries})`);
                    this.connect();
                }, this.options.retryDelay);
            } else {
                this.emit('maxRetriesReached');
            }
        };

        // Set up event listeners
        this.listeners.forEach((callback, eventType) => {
            this.eventSource.addEventListener(eventType, callback);
        });
    }

    on(eventType, callback) {
        this.listeners.set(eventType, (event) => {
            const data = JSON.parse(event.data);
            callback(data, event);
        });

        if (this.eventSource) {
            this.eventSource.addEventListener(eventType, this.listeners.get(eventType));
        }
    }

    emit(eventType, data = null) {
        if (this.options.onEvent) {
            this.options.onEvent(eventType, data);
        }
    }

    disconnect() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }
}

// Usage
const sseManager = new SSEManager('/notifications/stream', 'YOUR_TOKEN', {
    retryDelay: 5000,
    maxRetries: 3,
    onEvent: (type, data) => {
        console.log(`SSE Event: ${type}`, data);
    }
});

sseManager.on('notification', (data) => {
    console.log('Notification received:', data);
});

sseManager.connect();
```

## Environment Configuration

### Development vs Production
```javascript
// config.js
const config = {
    development: {
        sseEndpoint: 'http://localhost:3000',
        retryDelay: 1000,
        debug: true
    },
    production: {
        sseEndpoint: 'https://your-api.com',
        retryDelay: 5000,
        debug: false
    }
};

export const getConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    return config[env];
};
```

This documentation provides comprehensive examples for integrating with the NestJS SSE boilerplate across different frontend frameworks and scenarios.