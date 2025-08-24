import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImapEmail, ImapEmailSchema } from './imap.schema';
import { ImapService } from './imap.service';
import { ImapController } from './imap.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ImapEmail.name, schema: ImapEmailSchema }]),
  ],
  providers: [ImapService],
  controllers: [ImapController],
  exports: [ImapService],
})
export class ImapModule {}
