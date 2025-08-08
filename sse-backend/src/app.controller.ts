import { Controller, Get, Res, Logger } from '@nestjs/common';
import { Response } from 'express';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { SSEService } from './services/sse.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly sseService: SSEService) {}

  @Get()
  index(@Res() response: Response) {
    const indexPath = join(__dirname, 'index.html');
    
    if (existsSync(indexPath)) {
      response
        .type('text/html')
        .send(readFileSync(indexPath).toString());
    } else {
      // Provide a default HTML page if index.html doesn't exist
      response
        .type('text/html')
        .send(this.getDefaultIndexPage());
    }
  }

  @Get('api')
  getApiInfo() {
    const stats = this.sseService.getConnectionStats();
    
    return {
      name: 'NestJS SSE Boilerplate API',
      version: '1.0.0',
      description: 'Production-ready Server-Sent Events implementation with NestJS',
      endpoints: {
        notifications: {
          stream: 'GET /notifications/stream',
          send: 'POST /notifications/send',
          broadcast: 'POST /notifications/broadcast'
        },
        realtime: {
          stream: 'GET /realtime/stream',
          update: 'POST /realtime/update',
          entityCreate: 'POST /realtime/entity/:entity/create',
          entityUpdate: 'POST /realtime/entity/:entity/update',
          entityDelete: 'POST /realtime/entity/:entity/delete'
        },
        chat: {
          stream: 'GET /chat/stream',
          roomStream: 'GET /chat/room/:roomId/stream',
          sendMessage: 'POST /chat/message',
          joinRoom: 'POST /chat/room/:roomId/join',
          leaveRoom: 'POST /chat/room/:roomId/leave'
        },
        system: {
          statusStream: 'GET /system/status/stream',
          updateStatus: 'POST /system/status/update',
          connections: 'GET /system/connections',
          stats: 'GET /system/stats',
          cleanup: 'POST /system/cleanup',
          health: 'GET /system/health',
          heartbeat: 'GET /system/heartbeat'
        }
      },
      authentication: {
        description: 'Use Bearer token in Authorization header or token query parameter',
        example: 'Authorization: Bearer <base64-encoded-token>',
        tokenFormat: 'base64(userId:username:email:roles)',
        testToken: Buffer.from('test123:testuser:test@example.com:user,admin').toString('base64')
      },
      currentStats: stats,
      timestamp: new Date()
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    };
  }

  private getDefaultIndexPage(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NestJS SSE Boilerplate</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .endpoints {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .endpoint-group {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #007bff;
        }
        .endpoint {
            margin: 10px 0;
            font-family: monospace;
            background: #fff;
            padding: 8px 12px;
            border-radius: 4px;
            border: 1px solid #dee2e6;
        }
        .test-section {
            margin-top: 30px;
            padding: 20px;
            background: #e7f3ff;
            border-radius: 8px;
        }
        .auth-token {
            background: #fff3cd;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
            font-family: monospace;
            word-break: break-all;
            border: 1px solid #ffeaa7;
        }
        code {
            background: #f8f9fa;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 NestJS SSE Boilerplate</h1>
            <p>Production-ready Server-Sent Events implementation</p>
        </div>

        <div class="test-section">
            <h3>🔑 Test Authentication Token</h3>
            <p>Use this token for testing (includes in Authorization header or as query parameter):</p>
            <div class="auth-token">
                ${Buffer.from('test123:testuser:test@example.com:user,admin').toString('base64')}
            </div>
            <p><strong>Usage:</strong></p>
            <ul>
                <li>Header: <code>Authorization: Bearer [token]</code></li>
                <li>Query: <code>?token=[token]</code></li>
            </ul>
        </div>

        <div class="endpoints">
            <div class="endpoint-group">
                <h3>📢 Notifications</h3>
                <div class="endpoint">GET /notifications/stream</div>
                <div class="endpoint">POST /notifications/send</div>
                <div class="endpoint">POST /notifications/broadcast</div>
            </div>

            <div class="endpoint-group">
                <h3>⚡ Real-time Updates</h3>
                <div class="endpoint">GET /realtime/stream</div>
                <div class="endpoint">POST /realtime/update</div>
                <div class="endpoint">POST /realtime/entity/:entity/create</div>
            </div>

            <div class="endpoint-group">
                <h3>💬 Chat</h3>
                <div class="endpoint">GET /chat/stream</div>
                <div class="endpoint">GET /chat/room/:roomId/stream</div>
                <div class="endpoint">POST /chat/message</div>
            </div>

            <div class="endpoint-group">
                <h3>🔧 System</h3>
                <div class="endpoint">GET /system/status/stream</div>
                <div class="endpoint">GET /system/stats</div>
                <div class="endpoint">GET /system/health</div>
            </div>
        </div>

        <div class="test-section">
            <h3>🧪 Quick Test</h3>
            <p>Test SSE connection with JavaScript:</p>
            <pre><code>const eventSource = new EventSource('/notifications/stream?token=${Buffer.from('test123:testuser:test@example.com:user,admin').toString('base64')}');
eventSource.onmessage = (event) => {
    console.log('SSE Event:', JSON.parse(event.data));
};</code></pre>
        </div>

        <div class="test-section">
            <h3>📊 API Information</h3>
            <p><a href="/api">View full API documentation</a></p>
            <p><a href="/health">Check system health</a></p>
            <p><a href="/system/stats">View connection statistics</a></p>
        </div>
    </div>
</body>
</html>
    `;
  }
}
