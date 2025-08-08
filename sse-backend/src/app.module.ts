import { Module, OnApplicationShutdown, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { SSEService } from './services/sse.service';
import { NotificationsController } from './controllers/notifications.controller';
import { RealtimeController } from './controllers/realtime.controller';
import { ChatController } from './controllers/chat.controller';
import { SystemController } from './controllers/system.controller';
import { AuthGuard, OptionalAuthGuard } from './guards/auth.guard';

@Module({
  imports: [],
  controllers: [
    AppController,
    NotificationsController,
    RealtimeController,
    ChatController,
    SystemController,
  ],
  providers: [SSEService, AuthGuard, OptionalAuthGuard],
  exports: [SSEService],
})
export class AppModule implements OnApplicationShutdown {
  private readonly logger = new Logger(AppModule.name);

  constructor(private readonly sseService: SSEService) {}

  async onApplicationShutdown(signal?: string) {
    this.logger.log(`Application shutting down with signal: ${signal}`);

    // Cleanup SSE service
    this.sseService.onApplicationShutdown();

    this.logger.log('Application shutdown complete');
  }
}
