import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: true,
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001', 
        'http://localhost:4200',
        'http://localhost:5000',
        'http://localhost:8080',
        // Add your frontend domains here
        /^https:\/\/.*\.yourdomain\.com$/,
        /^https:\/\/.*\.vercel\.app$/,
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'Cache-Control',
        'X-Requested-With'
      ],
      credentials: true,
      optionsSuccessStatus: 200
    }
  });

  // Enable CORS explicitly for development
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: true,
      credentials: true
    });
    logger.log('Development CORS enabled for all origins');
  }

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Enable shutdown hooks for graceful cleanup
  app.enableShutdownHooks();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  logger.log(`🚀 SSE Application is running on: ${await app.getUrl()}`);
  logger.log(`📡 Available SSE endpoints:`);
  logger.log(`  - Notifications: /notifications/stream`);
  logger.log(`  - Real-time Updates: /realtime/stream`);
  logger.log(`  - Chat Messages: /chat/stream`);
  logger.log(`  - System Status: /system/status/stream`);
  logger.log(`  - Heartbeat: /system/heartbeat`);
}

bootstrap().catch(error => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
