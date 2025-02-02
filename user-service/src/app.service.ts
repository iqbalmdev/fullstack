import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Injectable()
export class AppService {
  @MessagePattern({ cmd: 'get_hello' })
  getHello(): string {
    return 'Hello from TCP Microservice!';
  }
}
