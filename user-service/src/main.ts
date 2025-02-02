import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({
  path: process.cwd() + `/.env.${process.env.NODE_ENV || 'development'}`,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Log the HTTP_PORT value
  const HTTP_PORT = configService.get<number>('HTTP_PORT', 5001);
  console.log('HTTP_PORT:', HTTP_PORT); // This should log the correct value

  const TCP_AUTH_PORT = configService.get<number>('TCP_AUTH_PORT', 5002); // TCP port for Auth Service
  const CORS_ORIGIN = configService.get<string>(
    'CORS_ORIGIN',
    'https://fullstack-kkbbghbia-iqbalmdevs-projects.vercel.app/',
  ); // CORS origin

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
