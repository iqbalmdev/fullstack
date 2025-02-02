import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  private client: ClientProxy;

  constructor(@InjectModel('User') private userModel: Model<User>) {
    // Use ClientProxyFactory to create the client proxy
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 5002 }, // Auth Service TCP port
    });
  }

  // ✅ Token validation function
  async validateToken(token: string): Promise<any> {
    console.log('coming in validat token------------>>>>');
    const response = await firstValueFrom(
      this.client.send<{ cmd: string }, { token: string }>(
        { cmd: 'validate_token' },
        { token },
      ),
    );
    return response; // Will return the result from Auth Service
  }

  // ✅ Create a new user
  async createUser(user: Partial<User>): Promise<User> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  // ✅ Get all users
  async findAllUsers(): Promise<User[]> {
    return await this.userModel.find({ deleted: 0 }).exec();
  }

  // ✅ Get user by ID
  async findUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // ✅ Update user
  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, userData, { new: true, runValidators: true })
      .exec();

    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  // ✅ Delete user
  async deleteUser(userId: string): Promise<{ message: string }> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { deleted: 1 }, // Set deleted to 1 for soft deletion
        { new: true }, // Return the updated document
      )
      .exec();

    if (!updatedUser) throw new NotFoundException('User not found');
    return { message: 'User deleted successfully' };
  }
}
