export interface SSEEvent<T = any> {
  id?: string;
  event?: string;
  data: T;
  retry?: number;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  userId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface RealTimeUpdate {
  id: string;
  entity: string;
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: Date;
  userId?: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: Record<string, any>;
}

export interface SystemStatus {
  id: string;
  service: string;
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  message?: string;
  timestamp: Date;
  metrics?: {
    cpu?: number;
    memory?: number;
    uptime?: number;
  };
}

export interface ConnectionInfo {
  id: string;
  userId?: string;
  connectedAt: Date;
  lastActivity: Date;
  subscriptions: string[];
}

export type SSEEventType = 
  | 'notification'
  | 'realtime-update'
  | 'chat-message'
  | 'system-status'
  | 'heartbeat'
  | 'connection-info';