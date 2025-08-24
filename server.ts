import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { INestApplication } from '@nestjs/common';

let app: INestApplication;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!app) {
    app = await NestFactory.create(AppModule);
    await app.init(); // initialize app without listening on a port
  }
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.getInstance()(req, res); // use the NestJS HTTP adapter to handle the request
}


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for React frontend
  app.enableCors({
    origin: [
      'http://localhost:4000', // React dev server
      'https://email-service-frontend-basic-m05bsu1i7.vercel.app' // frontend prod URL
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // if you are using cookies
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
