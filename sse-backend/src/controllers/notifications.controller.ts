import { 
  Controller, 
  Sse, 
  MessageEvent, 
  UseGuards, 
  Req, 
  Query, 
  Post, 
  Body,
  HttpCode,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SSEService } from '../services/sse.service';
import { OptionalAuthGuard, AuthGuard, AuthenticatedUser } from '../guards/auth.guard';
import { NotificationData } from '../types/sse.types';

@Controller('notifications')
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly sseService: SSEService) {}

  @Sse('stream')
  @UseGuards(OptionalAuthGuard)
  streamNotifications(@Req() req: Request): Observable<MessageEvent> {
    const user = req['user'] as AuthenticatedUser | undefined;
    const userId = user?.id;
    
    this.logger.log(`Starting notifications stream for user: ${userId || 'anonymous'}`);

    const { connectionId, stream, cleanup } = this.sseService.createConnection(
      userId,
      ['notifications', 'heartbeat']
    );

    // Set up cleanup on connection close
    req.on('close', () => {
      this.logger.log(`Notifications stream closed for connection: ${connectionId}`);
      cleanup();
    });

    return stream.pipe(
      map(event => ({
        id: event.id,
        type: event.event,
        data: JSON.stringify(event.data),
        retry: event.retry || 3000
      } as MessageEvent)),
      catchError((error) => {
        this.logger.error(`Error in notifications stream: ${error.message}`);
        cleanup();
        throw error;
      })
    );
  }

  @Post('send')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async sendNotification(
    @Body() notification: Omit<NotificationData, 'id' | 'timestamp'>,
    @Query('targetUserId') targetUserId?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const completeNotification: NotificationData = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        ...notification
      };

      this.sseService.sendNotification(completeNotification, targetUserId);
      
      this.logger.log(`Notification sent: ${notification.title} to ${targetUserId || 'all'}`);
      
      return {
        success: true,
        message: `Notification sent successfully to ${targetUserId || 'all subscribers'}`
      };
    } catch (error) {
      this.logger.error(`Failed to send notification: ${error.message}`);
      return {
        success: false,
        message: `Failed to send notification: ${error.message}`
      };
    }
  }

  @Post('broadcast')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async broadcastNotification(
    @Body() notification: Omit<NotificationData, 'id' | 'timestamp'>
  ): Promise<{ success: boolean; message: string; stats: any }> {
    try {
      const completeNotification: NotificationData = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        ...notification
      };

      this.sseService.sendNotification(completeNotification);
      const stats = this.sseService.getConnectionStats();
      
      this.logger.log(`Notification broadcast: ${notification.title}`);
      
      return {
        success: true,
        message: 'Notification broadcast successfully',
        stats
      };
    } catch (error) {
      this.logger.error(`Failed to broadcast notification: ${error.message}`);
      return {
        success: false,
        message: `Failed to broadcast notification: ${error.message}`,
        stats: null
      };
    }
  }
}