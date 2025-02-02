import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const HTTP_PORT = 4201; // HTTP API Server
  const TCP_AUTH_PORT = 5002; // TCP port for Auth Service

  // Create HTTP API Server
  const app = await NestFactory.create(AppModule);

  // Enable CORS globally
  app.enableCors({
    origin: 'https://fullstack-ten-gamma.vercel.app/', // Allow requests from localhost:3000
    methods: 'GET, POST, PUT, DELETE, OPTIONS', // Allow these methods
    allowedHeaders: 'Content-Type, Authorization', // Allow these headers
    credentials: true, // Allow credentials
  });

  await app.listen(HTTP_PORT);
  console.log(`🚀 User Service HTTP server running at: ${await app.getUrl()}`);

  // // Connect to the Auth Service via TCP
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.TCP,
  //   options: { host: '127.0.0.1', port: 5002 },
  // });

  // await app.startAllMicroservices();
  // console.log(
  //   `📡 User Service connected to Auth Service on TCP port ${TCP_AUTH_PORT}`,
  // );
}

bootstrap();
