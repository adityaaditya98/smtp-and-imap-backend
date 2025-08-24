import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailsModule } from './emails/emails.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ImapService } from './imap/imap.service';
import { ImapModule } from './imap/imap.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // ✅ Mongoose connection must be registered here
    MongooseModule.forRoot(process.env.MONGODB_URI!),

    EmailsModule,ImapModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
