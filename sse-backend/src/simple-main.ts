import { NestFactory } from '@nestjs/core';
import { AppController } from './app.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
class SimpleAppModule {}

async function bootstrap() {
  const app = await NestFactory.create(SimpleAppModule);
  
  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true
  });

  await app.listen(3000);
  console.log('🚀 Simple SSE Server running on: http://localhost:3000');
  console.log('📡 SSE endpoint: /sse');
}

bootstrap();