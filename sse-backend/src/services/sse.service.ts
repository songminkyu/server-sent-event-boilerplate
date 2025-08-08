import { Injectable, Logger } from '@nestjs/common';
import { Observable, Subject, BehaviorSubject, interval, timer } from 'rxjs';
import { map, filter, takeUntil, share, startWith } from 'rxjs/operators';
import { 
  SSEEvent, 
  NotificationData, 
  RealTimeUpdate, 
  ChatMessage, 
  SystemStatus, 
  ConnectionInfo,
  SSEEventType 
} from '../types/sse.types';

@Injectable()
export class SSEService {
  private readonly logger = new Logger(SSEService.name);
  private readonly connections = new Map<string, ConnectionInfo>();
  private readonly subjects = new Map<string, Subject<SSEEvent>>();
  
  // Event streams for different types
  private readonly notificationStream = new Subject<SSEEvent<NotificationData>>();
  private readonly realtimeUpdateStream = new Subject<SSEEvent<RealTimeUpdate>>();
  private readonly chatMessageStream = new Subject<SSEEvent<ChatMessage>>();
  private readonly systemStatusStream = new Subject<SSEEvent<SystemStatus>>();
  private readonly heartbeatStream = new BehaviorSubject<SSEEvent<{ timestamp: Date }>>({
    event: 'heartbeat',
    data: { timestamp: new Date() }
  });

  constructor() {
    // Start heartbeat every 30 seconds
    this.startHeartbeat();
    this.logger.log('SSE Service initialized');
  }

  /**
   * Create a new SSE connection
   */
  createConnection(userId?: string, subscriptions: string[] = []): {
    connectionId: string;
    stream: Observable<SSEEvent>;
    cleanup: () => void;
  } {
    const connectionId = this.generateConnectionId();
    const connectionInfo: ConnectionInfo = {
      id: connectionId,
      userId,
      connectedAt: new Date(),
      lastActivity: new Date(),
      subscriptions
    };

    this.connections.set(connectionId, connectionInfo);
    const subject = new Subject<SSEEvent>();
    this.subjects.set(connectionId, subject);

    // Create the combined stream based on subscriptions
    const stream = this.createCombinedStream(subscriptions, subject);

    // Cleanup function
    const cleanup = () => {
      this.removeConnection(connectionId);
      subject.complete();
    };

    this.logger.log(`Connection created: ${connectionId} for user: ${userId || 'anonymous'}`);
    
    // Send initial connection info
    this.sendToConnection(connectionId, {
      event: 'connection-info',
      data: connectionInfo
    });

    return {
      connectionId,
      stream,
      cleanup
    };
  }

  /**
   * Remove a connection
   */
  private removeConnection(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (connection) {
      this.connections.delete(connectionId);
      this.subjects.delete(connectionId);
      this.logger.log(`Connection removed: ${connectionId}`);
    }
  }

  /**
   * Create combined stream based on subscriptions
   */
  private createCombinedStream(subscriptions: string[], subject: Subject<SSEEvent>): Observable<SSEEvent> {
    const streams: Observable<SSEEvent>[] = [subject.asObservable()];

    // Add subscribed streams
    if (subscriptions.includes('notifications')) {
      streams.push(this.notificationStream.asObservable());
    }
    if (subscriptions.includes('realtime-updates')) {
      streams.push(this.realtimeUpdateStream.asObservable());
    }
    if (subscriptions.includes('chat')) {
      streams.push(this.chatMessageStream.asObservable());
    }
    if (subscriptions.includes('system-status')) {
      streams.push(this.systemStatusStream.asObservable());
    }
    if (subscriptions.includes('heartbeat')) {
      streams.push(this.heartbeatStream.asObservable());
    }

    // Merge all streams
    return new Observable<SSEEvent>(observer => {
      const subscriptions = streams.map(stream => 
        stream.subscribe(
          event => observer.next(event),
          error => observer.error(error)
        )
      );

      return () => subscriptions.forEach(sub => sub.unsubscribe());
    }).pipe(
      startWith({
        event: 'connected',
        data: { message: 'SSE connection established', timestamp: new Date() }
      }),
      share()
    );
  }

  /**
   * Send notification to all subscribed connections
   */
  sendNotification(notification: NotificationData, targetUserId?: string): void {
    const event: SSEEvent<NotificationData> = {
      id: this.generateEventId(),
      event: 'notification',
      data: notification
    };

    if (targetUserId) {
      // Send to specific user
      this.sendToUser(targetUserId, event);
    } else {
      // Broadcast to all notification subscribers
      this.notificationStream.next(event);
    }

    this.logger.debug(`Notification sent: ${notification.title} to ${targetUserId || 'all'}`);
  }

  /**
   * Send real-time update
   */
  sendRealTimeUpdate(update: RealTimeUpdate, targetUserId?: string): void {
    const event: SSEEvent<RealTimeUpdate> = {
      id: this.generateEventId(),
      event: 'realtime-update',
      data: update
    };

    if (targetUserId) {
      this.sendToUser(targetUserId, event);
    } else {
      this.realtimeUpdateStream.next(event);
    }

    this.logger.debug(`Real-time update sent: ${update.entity}:${update.action}`);
  }

  /**
   * Send chat message
   */
  sendChatMessage(message: ChatMessage, roomId?: string): void {
    const event: SSEEvent<ChatMessage> = {
      id: this.generateEventId(),
      event: 'chat-message',
      data: message
    };

    if (roomId) {
      // Send to users in specific room (implementation depends on your room management)
      this.sendToRoom(roomId, event);
    } else {
      this.chatMessageStream.next(event);
    }

    this.logger.debug(`Chat message sent to room: ${message.roomId}`);
  }

  /**
   * Send system status update
   */
  sendSystemStatus(status: SystemStatus): void {
    const event: SSEEvent<SystemStatus> = {
      id: this.generateEventId(),
      event: 'system-status',
      data: status
    };

    this.systemStatusStream.next(event);
    this.logger.debug(`System status update: ${status.service} - ${status.status}`);
  }

  /**
   * Send custom event to specific connection
   */
  sendToConnection(connectionId: string, event: SSEEvent): void {
    const subject = this.subjects.get(connectionId);
    const connection = this.connections.get(connectionId);
    
    if (subject && connection) {
      connection.lastActivity = new Date();
      subject.next(event);
    }
  }

  /**
   * Send event to specific user (all their connections)
   */
  private sendToUser(userId: string, event: SSEEvent): void {
    const userConnections = Array.from(this.connections.entries())
      .filter(([_, conn]) => conn.userId === userId);

    userConnections.forEach(([connectionId, _]) => {
      this.sendToConnection(connectionId, event);
    });
  }

  /**
   * Send event to room (requires room management implementation)
   */
  private sendToRoom(roomId: string, event: SSEEvent): void {
    // This is a basic implementation - you might want to maintain room memberships
    // For now, broadcast to all chat subscribers
    this.chatMessageStream.next(event);
  }

  /**
   * Get connection statistics
   */
  getConnectionStats(): {
    totalConnections: number;
    authenticatedConnections: number;
    connectionsByType: Record<string, number>;
  } {
    const totalConnections = this.connections.size;
    const authenticatedConnections = Array.from(this.connections.values())
      .filter(conn => conn.userId).length;

    const connectionsByType: Record<string, number> = {};
    Array.from(this.connections.values()).forEach(conn => {
      conn.subscriptions.forEach(sub => {
        connectionsByType[sub] = (connectionsByType[sub] || 0) + 1;
      });
    });

    return {
      totalConnections,
      authenticatedConnections,
      connectionsByType
    };
  }

  /**
   * Get active connections
   */
  getActiveConnections(): ConnectionInfo[] {
    return Array.from(this.connections.values());
  }

  /**
   * Start heartbeat mechanism
   */
  private startHeartbeat(): void {
    interval(30000).subscribe(() => {
      this.heartbeatStream.next({
        event: 'heartbeat',
        data: { timestamp: new Date() }
      });
    });
  }

  /**
   * Generate unique connection ID
   */
  private generateConnectionId(): string {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup inactive connections
   */
  cleanupInactiveConnections(maxInactiveTime: number = 5 * 60 * 1000): void {
    const now = new Date();
    const inactiveConnections: string[] = [];

    this.connections.forEach((connection, connectionId) => {
      if (now.getTime() - connection.lastActivity.getTime() > maxInactiveTime) {
        inactiveConnections.push(connectionId);
      }
    });

    inactiveConnections.forEach(connectionId => {
      this.removeConnection(connectionId);
    });

    if (inactiveConnections.length > 0) {
      this.logger.log(`Cleaned up ${inactiveConnections.length} inactive connections`);
    }
  }

  /**
   * Shutdown service
   */
  onApplicationShutdown(): void {
    this.logger.log('Shutting down SSE service...');
    
    // Complete all subjects
    this.subjects.forEach(subject => subject.complete());
    this.notificationStream.complete();
    this.realtimeUpdateStream.complete();
    this.chatMessageStream.complete();
    this.systemStatusStream.complete();
    this.heartbeatStream.complete();
    
    // Clear connections
    this.connections.clear();
    this.subjects.clear();
    
    this.logger.log('SSE service shutdown complete');
  }
}