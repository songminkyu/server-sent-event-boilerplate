// SSE Event Types
export interface SSEEvent {
  id?: string;
  type: string;
  data: any;
  timestamp: number;
}

export interface NotificationEvent {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  targetUserId?: string;
  action?: {
    label: string;
    url: string;
  };
}

export interface RealtimeEvent {
  id: string;
  entityType: string;
  entityId: string;
  action: 'created' | 'updated' | 'deleted';
  data: any;
  timestamp: number;
  userId: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  message: string;
  timestamp: number;
  type: 'message' | 'system' | 'join' | 'leave';
}

export interface SystemStatus {
  timestamp: number;
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  connections: number;
  memoryUsage: {
    used: number;
    total: number;
  };
  cpuUsage: number;
}

export interface ConnectionStats {
  connected: boolean;
  connectionTime?: number;
  lastEventTime?: number;
  reconnectCount: number;
  totalEvents: number;
  errorCount: number;
}