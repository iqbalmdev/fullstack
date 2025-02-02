import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthSchema } from './auth.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }]), // Register the Auth schema
    JwtModule.register({
      secret: 'SECRET_KEY', // Change this for production
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController], // Register AuthController
  providers: [AuthService, JwtService], // Register AuthService
})
export class AuthModule {}
