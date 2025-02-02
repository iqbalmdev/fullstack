import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  private authClient: ClientProxy;

  constructor() {
    this.authClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 5002 }, // Auth Service TCP Port
    });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }
    console.log(authHeader,"see auth header")
    const token = authHeader.split(' ')[1]; // Extract token

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.authClient
        .send({ cmd: 'validate_token' }, { token }) // TCP call to Auth Service
        .toPromise();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!result.valid) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        throw new UnauthorizedException(result.error);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      req['user'] = result.user; // Attach user data to request
      next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
