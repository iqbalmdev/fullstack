import { Controller, Get } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Controller('test-auth')
export class TestAuthController {
  private authClient: ClientProxy;

  constructor() {
    this.authClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 5002 },
    });
  }

  @Get()
  async testAuthService() {
    try {
      const result = await this.authClient
        .send({ cmd: 'validate_token' }, { token: 'INVALID_TOKEN' }) // Dummy token test
        .toPromise();
      return result;
    } catch (error) {
      console.error('Auth Service Connection Error:', error);
      return { error: 'Failed to connect to Auth Service' };
    }
  }
}
