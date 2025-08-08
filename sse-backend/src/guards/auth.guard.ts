import { 
  Injectable, 
  CanActivate, 
  ExecutionContext, 
  UnauthorizedException,
  Logger 
} from '@nestjs/common';
import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token is required');
    }

    try {
      // This is a simplified authentication - replace with your actual auth logic
      const user = this.validateToken(token);
      request['user'] = user;
      return true;
    } catch (error) {
      this.logger.error(`Authentication failed: ${error.message}`);
      throw new UnauthorizedException('Invalid authentication token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // Check Authorization header
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check query parameter (for SSE connections)
    const queryToken = request.query.token as string;
    if (queryToken) {
      return queryToken;
    }

    return undefined;
  }

  private validateToken(token: string): AuthenticatedUser {
    // IMPORTANT: This is a simplified token validation
    // In production, you should:
    // 1. Verify JWT signature
    // 2. Check token expiration
    // 3. Validate against your user database
    // 4. Handle refresh tokens
    
    try {
      // Simple token format: "user_id:username:email"
      // In production, use proper JWT validation
      const parts = Buffer.from(token, 'base64').toString().split(':');
      
      if (parts.length < 3) {
        throw new Error('Invalid token format');
      }

      return {
        id: parts[0],
        username: parts[1],
        email: parts[2],
        roles: parts[3]?.split(',') || ['user']
      };
    } catch (error) {
      throw new Error('Token validation failed');
    }
  }
}

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  private readonly logger = new Logger(OptionalAuthGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (token) {
      try {
        const user = this.validateToken(token);
        request['user'] = user;
      } catch (error) {
        this.logger.warn(`Optional authentication failed: ${error.message}`);
        // Don't throw error for optional auth
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    const queryToken = request.query.token as string;
    if (queryToken) {
      return queryToken;
    }

    return undefined;
  }

  private validateToken(token: string): AuthenticatedUser {
    try {
      const parts = Buffer.from(token, 'base64').toString().split(':');
      
      if (parts.length < 3) {
        throw new Error('Invalid token format');
      }

      return {
        id: parts[0],
        username: parts[1],
        email: parts[2],
        roles: parts[3]?.split(',') || ['user']
      };
    } catch (error) {
      throw new Error('Token validation failed');
    }
  }
}