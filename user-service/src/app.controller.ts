import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return `${this.appService.getHello()}`;
  }
}
