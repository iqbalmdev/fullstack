import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from './auth.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth') private authModel: Model<Auth>, // Inject the Auth model
    private jwtService: JwtService, // Inject the JwtService
  ) {}

  private readonly secretKey = 'SECRET_KEY';
  // 🟢 Signup Function
  async signup(name: string, email: string, password: string): Promise<Auth> {
    const existingUser = await this.authModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Hash the password with a salt round of 10
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new this.authModel({
      name,
      email,
      password: hashedPassword,
    });

    return await newUser.save();
  }

  // 🟠 Validate User for Login
  async validateUser(email: string, password: string): Promise<Auth | null> {
    const user = await this.authModel.findOne({ email }).exec();
    if (!user) return null;

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  // 🔵 Generate JWT Token
  login(user: Auth): { token: string } {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  // 🟣 Validate Token (For TCP Communication)

  validateToken(token: string): boolean {
    try {
      // Verify the JWT token
      console.log("tcp connected")
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.jwtService.verify(token, { secret: this.secretKey });
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }

  // TCP Message Handler for Token Validation
  // @MessagePattern('validate_token') // Message pattern for token validation
  // handleValidateToken(@Payload() token: string) {
  //   const isValid = this.validateToken(token);
  //   return { isValid };
  // }
};