import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { Email } from './emails.schema';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Get('latest')
  async getLatest() {
    return this.emailsService.getLatest();
  }
  @Post('send')
  async sendTestEmail(@Body() email : Email) {
    try{
    let savedEmail = await this.emailsService.sendMail(email.to, email.subject);
    savedEmail = {
        ...savedEmail,
        subject : email.subject,
    }
    this.emailsService.saveEmail(savedEmail);
    return savedEmail;
    } catch (error) {
      return { error: 'Failed to send email' };
    }

  }
}
