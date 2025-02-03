import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('dummy')
  getHello() {
    return '✅ Server is alive!';
  }
}
