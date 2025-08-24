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
