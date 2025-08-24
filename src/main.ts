import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:4000', // React dev
      'https://email-service-frontend-basic-pmkr5t5t8.vercel.app', // your deployed frontend
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // only if backend uses cookies/auth
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
