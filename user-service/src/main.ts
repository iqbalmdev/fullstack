import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables from .env file
dotenv.config({
  path: process.cwd() + `/.env.${process.env.NODE_ENV || 'development'}`,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const HTTP_PORT = 4001;
  console.log('HTTP_PORT:', HTTP_PORT);

  const CORS_ORIGIN = [
    'http://localhost:3000',
    'https://fullstack-sandy-zeta.vercel.app',
    'https://your-new-origin.com',
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

  // 🔹 Call Dummy API Every Second
  //eslint-disable-next-line @typescript-eslint/no-misused-promises
  setInterval(async () => {
    try {
      const response = await axios.get(
        `https://fullstack-zsdg.onrender.com/users/dummy/live`,
      );
      console.log(`Dummy API Called: ${response.data}`);
    } catch (error) {
      console.error('Error calling dummy API:', error);
    }
  }, 8000); // 1000ms = 1 second
}

bootstrap();
