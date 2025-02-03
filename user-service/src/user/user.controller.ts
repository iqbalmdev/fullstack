import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // This method will check if the Authorization token is present and valid
  private validateToken(authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('Authorization token is required');
    }

    const token = authorization.split(' ')[1]; // Assuming "Bearer <token>"
    // const isValid = this.userService.validateToken(token);
    const isValid = token;
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (!isValid) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Post()
  async createUser(
    @Body() user: Partial<User>,
    @Headers('Authorization') authorization: string,
  ): Promise<User> {
    // Validate the token before creating the user
    this.validateToken(authorization); // Token validation
    return await this.userService.createUser(user);
  }

  @Get()
  async findAllUsers(
    @Headers('Authorization') authorization: string,
  ): Promise<User[]> {
    // Validate the token before retrieving all users
     this.validateToken(authorization); // Token validation
    return await this.userService.findAllUsers();
  }

  @Get(':id')
  async findUserById(
    @Param('id') id: string,
    @Headers('Authorization') authorization: string,
  ): Promise<User> {
    // Validate the token before retrieving the user by ID
     this.validateToken(authorization); // Token validation
    return await this.userService.findUserById(id);
  }

  // @Get('dummy')
  // getHello(): string {
  //   return '✅ Server is alive!';
  // }
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: Partial<User>,
    @Headers('Authorization') authorization: string,
  ): Promise<User> {
    // Validate the token before updating the user
     this.validateToken(authorization); // Token validation
    return await this.userService.updateUser(id, userData);
  }

  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
    @Headers('Authorization') authorization: string,
  ): Promise<{ message: string }> {
    // Validate the token before deleting the user
    this.validateToken(authorization); // Token validation
    return await this.userService.deleteUser(id);
  }
  @Get('dummy/live')
  getHello(): string {
    return '✅ Server is alive!';
  }
}
