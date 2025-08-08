import { 
  Controller, 
  Sse, 
  MessageEvent, 
  UseGuards, 
  Req, 
  Post, 
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  Get
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SSEService } from '../services/sse.service';
import { OptionalAuthGuard, AuthGuard, AuthenticatedUser } from '../guards/auth.guard';
import { SystemStatus, ConnectionInfo } from '../types/sse.types';

@Controller('system')
export class SystemController {
  private readonly logger = new Logger(SystemController.name);

  constructor(private readonly sseService: SSEService) {}

  @Sse('status/stream')
  @UseGuards(OptionalAuthGuard)
  streamSystemStatus(@Req() req: Request): Observable<MessageEvent> {
    const user = req['user'] as AuthenticatedUser | undefined;
    const userId = user?.id;
    
    this.logger.log(`Starting system status stream for user: ${userId || 'anonymous'}`);

    const { connectionId, stream, cleanup } = this.sseService.createConnection(
      userId,
      ['system-status', 'heartbeat']
    );

    // Set up cleanup on connection close
    req.on('close', () => {
      this.logger.log(`System status stream closed for connection: ${connectionId}`);
      cleanup();
    });

    return stream.pipe(
      map(event => ({
        id: event.id,
        type: event.event,
        data: JSON.stringify(event.data),
        retry: event.retry || 5000
      } as MessageEvent)),
      catchError((error) => {
        this.logger.error(`Error in system status stream: ${error.message}`);
        cleanup();
        throw error;
      })
    );
  }

  @Post('status/update')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateSystemStatus(
    @Body() status: Omit<SystemStatus, 'id' | 'timestamp'>
  ): Promise<{ success: boolean; message: string }> {
    try {
      const completeStatus: SystemStatus = {
        id: `status_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        ...status
      };

      this.sseService.sendSystemStatus(completeStatus);
      
      this.logger.log(`System status updated: ${status.service} - ${status.status}`);
      
      return {
        success: true,
        message: `System status updated for ${status.service}`
      };
    } catch (error) {
      this.logger.error(`Failed to update system status: ${error.message}`);
      return {
        success: false,
        message: `Failed to update system status: ${error.message}`
      };
    }
  }

  @Get('connections')
  @UseGuards(AuthGuard)
  getConnections(): {
    connections: ConnectionInfo[];
    stats: {
      totalConnections: number;
      authenticatedConnections: number;
      connectionsByType: Record<string, number>;
    };
  } {
    const connections = this.sseService.getActiveConnections();
    const stats = this.sseService.getConnectionStats();
    
    return {
      connections,
      stats
    };
  }

  @Get('stats')
  @UseGuards(OptionalAuthGuard)
  getStats(): {
    totalConnections: number;
    authenticatedConnections: number;
    connectionsByType: Record<string, number>;
  } {
    return this.sseService.getConnectionStats();
  }

  @Post('cleanup')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  cleanupConnections(): { 
    success: boolean; 
    message: string;
    statsBefore: any;
    statsAfter: any;
  } {
    const statsBefore = this.sseService.getConnectionStats();
    
    // Clean up connections inactive for more than 5 minutes
    this.sseService.cleanupInactiveConnections(5 * 60 * 1000);
    
    const statsAfter = this.sseService.getConnectionStats();
    
    const cleaned = statsBefore.totalConnections - statsAfter.totalConnections;
    
    return {
      success: true,
      message: `Cleaned up ${cleaned} inactive connections`,
      statsBefore,
      statsAfter
    };
  }

  @Get('health')
  getHealth(): {
    status: 'ok' | 'degraded' | 'down';
    timestamp: Date;
    version: string;
    uptime: number;
    connections: number;
  } {
    const stats = this.sseService.getConnectionStats();
    
    return {
      status: 'ok',
      timestamp: new Date(),
      version: '1.0.0',
      uptime: process.uptime(),
      connections: stats.totalConnections
    };
  }

  @Sse('heartbeat')
  @UseGuards(OptionalAuthGuard)
  heartbeat(@Req() req: Request): Observable<MessageEvent> {
    const user = req['user'] as AuthenticatedUser | undefined;
    const userId = user?.id;
    
    this.logger.log(`Starting heartbeat stream for user: ${userId || 'anonymous'}`);

    const { connectionId, stream, cleanup } = this.sseService.createConnection(
      userId,
      ['heartbeat']
    );

    // Set up cleanup on connection close
    req.on('close', () => {
      this.logger.log(`Heartbeat stream closed for connection: ${connectionId}`);
      cleanup();
    });

    return stream.pipe(
      map(event => ({
        id: event.id,
        type: event.event,
        data: JSON.stringify(event.data),
        retry: event.retry || 30000
      } as MessageEvent)),
      catchError((error) => {
        this.logger.error(`Error in heartbeat stream: ${error.message}`);
        cleanup();
        throw error;
      })
    );
  }
}