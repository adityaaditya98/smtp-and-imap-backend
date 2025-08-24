import { Controller, Get } from '@nestjs/common';
import { ImapService } from './imap.service';

@Controller('imap-emails')
export class ImapController {
  constructor(private readonly imapService: ImapService) {}

  @Get()
  async getAll() {
    return this.imapService.getAll();
  }

  @Get('latest')
  async getLatest() {
    return this.imapService.getLatest();
  }
}
