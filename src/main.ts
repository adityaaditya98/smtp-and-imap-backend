import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cors = require('cors');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors({ origin: '*' }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
