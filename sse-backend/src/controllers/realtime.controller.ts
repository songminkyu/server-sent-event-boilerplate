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
import { RealTimeUpdate } from '../types/sse.types';

@Controller('realtime')
export class RealtimeController {
  private readonly logger = new Logger(RealtimeController.name);

  constructor(private readonly sseService: SSEService) {}

  @Sse('stream')
  @UseGuards(OptionalAuthGuard)
  streamRealTimeUpdates(
    @Req() req: Request,
    @Query('entities') entities?: string
  ): Observable<MessageEvent> {
    const user = req['user'] as AuthenticatedUser | undefined;
    const userId = user?.id;
    
    this.logger.log(`Starting realtime stream for user: ${userId || 'anonymous'}, entities: ${entities || 'all'}`);

    const { connectionId, stream, cleanup } = this.sseService.createConnection(
      userId,
      ['realtime-updates', 'heartbeat']
    );

    // Set up cleanup on connection close
    req.on('close', () => {
      this.logger.log(`Realtime stream closed for connection: ${connectionId}`);
      cleanup();
    });

    return stream.pipe(
      map(event => {
        // Filter by entities if specified
        if (entities && event.event === 'realtime-update') {
          const entityList = entities.split(',');
          const updateData = event.data as RealTimeUpdate;
          if (!entityList.includes(updateData.entity)) {
            return null; // Skip this event
          }
        }

        return {
          id: event.id,
          type: event.event,
          data: JSON.stringify(event.data),
          retry: event.retry || 3000
        } as MessageEvent;
      }),
      catchError((error) => {
        this.logger.error(`Error in realtime stream: ${error.message}`);
        cleanup();
        throw error;
      })
    );
  }

  @Post('update')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async sendRealTimeUpdate(
    @Body() update: Omit<RealTimeUpdate, 'id' | 'timestamp'>,
    @Query('targetUserId') targetUserId?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const completeUpdate: RealTimeUpdate = {
        id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        ...update
      };

      this.sseService.sendRealTimeUpdate(completeUpdate, targetUserId);
      
      this.logger.log(`Real-time update sent: ${update.entity}:${update.action} to ${targetUserId || 'all'}`);
      
      return {
        success: true,
        message: `Real-time update sent successfully to ${targetUserId || 'all subscribers'}`
      };
    } catch (error) {
      this.logger.error(`Failed to send real-time update: ${error.message}`);
      return {
        success: false,
        message: `Failed to send real-time update: ${error.message}`
      };
    }
  }

  @Post('entity/:entity/create')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async entityCreated(
    @Req() req: Request,
    @Body() data: any
  ): Promise<{ success: boolean; message: string }> {
    const entity = req.params.entity;
    const user = req['user'] as AuthenticatedUser;

    const update: RealTimeUpdate = {
      id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      entity,
      action: 'create',
      data,
      timestamp: new Date(),
      userId: user.id
    };

    this.sseService.sendRealTimeUpdate(update);
    
    return {
      success: true,
      message: `Entity ${entity} creation broadcasted`
    };
  }

  @Post('entity/:entity/update')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async entityUpdated(
    @Req() req: Request,
    @Body() data: any
  ): Promise<{ success: boolean; message: string }> {
    const entity = req.params.entity;
    const user = req['user'] as AuthenticatedUser;

    const update: RealTimeUpdate = {
      id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      entity,
      action: 'update',
      data,
      timestamp: new Date(),
      userId: user.id
    };

    this.sseService.sendRealTimeUpdate(update);
    
    return {
      success: true,
      message: `Entity ${entity} update broadcasted`
    };
  }

  @Post('entity/:entity/delete')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async entityDeleted(
    @Req() req: Request,
    @Body() data: { id: string }
  ): Promise<{ success: boolean; message: string }> {
    const entity = req.params.entity;
    const user = req['user'] as AuthenticatedUser;

    const update: RealTimeUpdate = {
      id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      entity,
      action: 'delete',
      data,
      timestamp: new Date(),
      userId: user.id
    };

    this.sseService.sendRealTimeUpdate(update);
    
    return {
      success: true,
      message: `Entity ${entity} deletion broadcasted`
    };
  }
}