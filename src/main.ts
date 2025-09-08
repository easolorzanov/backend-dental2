import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.setGlobalPrefix('api');

  // CORS configuration for production
  const allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost:8100',
    'https://localhost:8100',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:4200',
    '*'
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Aplicación dental ejecutándose en puerto ${port}`);
}

bootstrap();
