import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
// import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  // HTTP API Server
  const TCP_PORT = 5002; // TCP Microservice for token validation

  // Create HTTP API Server
  const app = await NestFactory.create(AppModule);
  // const configService = app.get(ConfigService);
  const HTTP_PORT = 5001;
  // Enable CORS for HTTP API
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const CORS_ORIGIN = [
    'http://localhost:3000',
    'https://fullstack-sandy-zeta.vercel.app',
    'https://your-new-origin.com', // Add your new origins here
    'https://another-allowed-origin.com',
  ];

  app.enableCors({
    origin: CORS_ORIGIN,
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
