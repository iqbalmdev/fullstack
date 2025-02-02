import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const HTTP_PORT = 5001; // HTTP API Server
  const TCP_PORT = 5002; // TCP Microservice for token validation

  // Create HTTP API Server
  const app = await NestFactory.create(AppModule);

  // Enable CORS for HTTP API
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  await app.listen(HTTP_PORT);
  console.log(
    `🚀 Auth Service HTTP server running on http://localhost:${HTTP_PORT}`,
  );

  // Start TCP Microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: 5002 },
  });

  await app.startAllMicroservices();
  console.log(`📡 Auth Service TCP microservice running on port ${TCP_PORT}`);
}

bootstrap();
