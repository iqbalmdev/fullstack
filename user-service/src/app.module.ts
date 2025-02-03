import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserSchema } from './user/user.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://kathanipanpoli:9sj9cKRs1qlaiy3Z@nextdb.rbv5h.mongodb.net/?retryWrites=true&w=majority&appName=nextdb',
    ),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 4000 }, // Adjust based on your AuthService
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
