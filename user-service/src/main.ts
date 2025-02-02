import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({
  path: process.cwd() + `/.env.${process.env.NODE_ENV || 'development'}`,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Log the HTTP_PORT value
  const HTTP_PORT = 4001;
  console.log('HTTP_PORT:', HTTP_PORT); // This should log the correct value

  // const TCP_AUTH_PORT = configService.get<number>('TCP_AUTH_PORT', 5002); // TCP port for Auth Service
  const CORS_ORIGIN = [
    'http://localhost:3000',
    'https://fullstack-sandy-zeta.vercel.app',
    'https://your-new-origin.com', // Add your new origins here
    'https://another-allowed-origin.com',
  ];

  // Enable CORS globally
  app.enableCors({
    origin: CORS_ORIGIN,
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  await app.listen(HTTP_PORT);
  console.log(`🚀 User Service HTTP server running at: ${await app.getUrl()}`);
}

bootstrap();
