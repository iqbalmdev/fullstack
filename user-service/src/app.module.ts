import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserSchema } from './user/user.schema';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration global
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // Load environment-specific .env file
    }),

    // Configure Mongoose asynchronously using ConfigService
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: 'mongodb+srv://kathanipanpoli:9sj9cKRs1qlaiy3Z@nextdb.rbv5h.mongodb.net/?retryWrites=true&w=majority&appName=nextdb' // Get MongoDB URI from environment variables
      }),
      inject: [ConfigService],
    }),

    // Register the User schema
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
