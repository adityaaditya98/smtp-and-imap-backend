import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email, EmailDocument } from './emails.schema';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailsService {
  constructor(@InjectModel(Email.name) private emailModel: Model<EmailDocument>) {}

  async saveEmail(data: any) {
    let value = {
        messageId: data.messageId,
        subject: data.subject,
        from: data.envelope.from,
        to: data.envelope.to.join(', '),
        receivingChain: data.accepted,
        esp: this.detectESP(data.response),
        rawHeaders: JSON.stringify(data),
    }
    return this.emailModel.create(value);
  }

  async getLatest() {
    return this.emailModel.find().sort({ createdAt: -1 }).limit(1);
  }

  detectESP(headers: string): string {
    if (/google\.com/i.test(headers)) return 'Gmail';
    if (/outlook\.com/i.test(headers)) return 'Outlook';
    if (/amazonses\.com/i.test(headers)) return 'Amazon SES';
    if (/zoho\.com/i.test(headers)) return 'Zoho';
    return 'Unknown';
  }

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  async sendMail(to: string, subject: string) {
    return this.transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
    });
  }
}
