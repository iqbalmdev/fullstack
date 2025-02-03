import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Options,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern,ClientProxy,ClientProxyFactory,Transport,Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {

  }

  // 🔹 TCP handler for token validation
  
  async validateToken(data: { token: string }) {
    return this.authService.validateToken(data.token);
  }
  // Handle OPTIONS preflight request explicitly
  @Options('login')
  options() {
    // CORS headers are set globally, so we can just return an empty response
    return {};
  }

  // 🔵 Login Route
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    return this.authService.login(user);
  }
  @Get('dummy')
  getHello(): string {
    return '✅ Server is alive!';
  }
  // 🔵 Signup Route
  @Post('signup')
  async signup(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    if (!name || !email || !password) {
      throw new BadRequestException('All fields are required');
    }
    return await this.authService.signup(name, email, password);
  }
  // @MessagePattern({ cmd: 'validate_token' })
  // handleValidateToken(payload: string) {
  //   console.log(payload,"See payload")
  //   const isValid = this.validateToken(payload);
  //   return { isValid };
  // }
}
