import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module'; // Import AuthModule
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthSchema } from './auth/auth.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://kathanipanpoli:9sj9cKRs1qlaiy3Z@nextdb.rbv5h.mongodb.net/?retryWrites=true&w=majority&appName=nextdb',
    ),
    MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }]), // Auth Schema
    JwtModule.register({
      secret: 'SECRET_KEY', // Change this for production
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule, // Register AuthModule here
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
