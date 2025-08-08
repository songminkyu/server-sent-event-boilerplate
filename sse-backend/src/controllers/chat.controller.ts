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
  Logger,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { SSEService } from '../services/sse.service';
import { AuthGuard, AuthenticatedUser } from '../guards/auth.guard';
import { ChatMessage } from '../types/sse.types';

@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly sseService: SSEService) {}

  @Sse('stream')
  @UseGuards(AuthGuard)
  streamChatMessages(
    @Req() req: Request,
    @Query('roomId') roomId?: string,
  ): Observable<MessageEvent> {
    const user = req['user'] as AuthenticatedUser;
    this.logger.debug(`안녕!!!!!!! Starting chat stream`);
    this.logger.log(
      `Starting chat stream for user: ${user.id}, room: ${roomId || 'all'}`,
    );

    const { connectionId, stream, cleanup } = this.sseService.createConnection(
      user.id,
      ['chat', 'heartbeat'],
    );

    // Set up cleanup on connection close
    req.on('close', () => {
      this.logger.log(`Chat stream closed for connection: ${connectionId}`);
      cleanup();
    });

    return stream.pipe(
      map((event) => {
        // Filter by room if specified
        if (roomId && event.event === 'chat-message') {
          const messageData = event.data as ChatMessage;
          if (messageData.roomId !== roomId) {
            return null; // Skip this event
          }
        }

        return {
          id: event.id,
          type: event.event,
          data: JSON.stringify(event.data),
          retry: event.retry || 3000,
        } as MessageEvent;
      }),
      filter((event) => event !== null), // Remove null events
      catchError((error) => {
        this.logger.error(`Error in chat stream: ${error.message}`);
        cleanup();
        throw error;
      }),
    );
  }

  @Sse('room/:roomId/stream')
  @UseGuards(AuthGuard)
  streamRoomMessages(
    @Req() req: Request,
    @Param('roomId') roomId: string,
  ): Observable<MessageEvent> {
    const user = req['user'] as AuthenticatedUser;
    this.logger.debug(`안녕!!!!!!! Starting chat stream ##########`);
    this.logger.log(
      `Starting room chat stream for user: ${user.id}, room: ${roomId}`,
    );

    const { connectionId, stream, cleanup } = this.sseService.createConnection(
      user.id,
      ['chat', 'heartbeat'],
    );

    // Set up cleanup on connection close
    req.on('close', () => {
      this.logger.log(
        `Room chat stream closed for connection: ${connectionId}`,
      );
      cleanup();
    });

    return stream.pipe(
      map((event) => {
        // Filter by specific room
        if (event.event === 'chat-message') {
          const messageData = event.data as ChatMessage;
          if (messageData.roomId !== roomId) {
            return null; // Skip messages from other rooms
          }
        }

        return {
          id: event.id,
          type: event.event,
          data: JSON.stringify(event.data),
          retry: event.retry || 3000,
        } as MessageEvent;
      }),
      filter((event) => event !== null),
      catchError((error) => {
        this.logger.error(`Error in room chat stream: ${error.message}`);
        cleanup();
        throw error;
      }),
    );
  }

  @Post('message')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async sendMessage(
    @Req() req: Request,
    @Body()
    messageData: {
      roomId: string;
      message: string;
      type?: 'text' | 'image' | 'file';
      metadata?: Record<string, any>;
    },
  ): Promise<{ success: boolean; message: string; messageId: string }> {
    const user = req['user'] as AuthenticatedUser;

    try {
      const chatMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        roomId: messageData.roomId,
        userId: user.id,
        username: user.username,
        message: messageData.message,
        type: messageData.type || 'text',
        timestamp: new Date(),
        metadata: messageData.metadata,
      };

      this.sseService.sendChatMessage(chatMessage, messageData.roomId);

      this.logger.log(
        `Chat message sent by ${user.username} to room ${messageData.roomId}`,
      );

      return {
        success: true,
        message: 'Message sent successfully',
        messageId: chatMessage.id,
      };
    } catch (error) {
      this.logger.error(`Failed to send chat message: ${error.message}`);
      return {
        success: false,
        message: `Failed to send message: ${error.message}`,
        messageId: null,
      };
    }
  }

  @Post('room/:roomId/join')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async joinRoom(
    @Req() req: Request,
    @Param('roomId') roomId: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = req['user'] as AuthenticatedUser;

    try {
      // Send system message about user joining
      const systemMessage: ChatMessage = {
        id: `sys_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        roomId,
        userId: 'system',
        username: 'System',
        message: `${user.username} joined the room`,
        type: 'system',
        timestamp: new Date(),
      };

      this.sseService.sendChatMessage(systemMessage, roomId);

      this.logger.log(`User ${user.username} joined room ${roomId}`);

      return {
        success: true,
        message: `Successfully joined room ${roomId}`,
      };
    } catch (error) {
      this.logger.error(`Failed to join room: ${error.message}`);
      return {
        success: false,
        message: `Failed to join room: ${error.message}`,
      };
    }
  }

  @Post('room/:roomId/leave')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async leaveRoom(
    @Req() req: Request,
    @Param('roomId') roomId: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = req['user'] as AuthenticatedUser;

    try {
      // Send system message about user leaving
      const systemMessage: ChatMessage = {
        id: `sys_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        roomId,
        userId: 'system',
        username: 'System',
        message: `${user.username} left the room`,
        type: 'system',
        timestamp: new Date(),
      };

      this.sseService.sendChatMessage(systemMessage, roomId);

      this.logger.log(`User ${user.username} left room ${roomId}`);

      return {
        success: true,
        message: `Successfully left room ${roomId}`,
      };
    } catch (error) {
      this.logger.error(`Failed to leave room: ${error.message}`);
      return {
        success: false,
        message: `Failed to leave room: ${error.message}`,
      };
    }
  }
}
