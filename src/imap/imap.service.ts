import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Imap from 'node-imap';
import { simpleParser } from 'mailparser';
import { ImapEmail, ImapEmailDocument } from './imap.schema';

@Injectable()
export class ImapService implements OnModuleInit {
  constructor(
    @InjectModel(ImapEmail.name) private imapEmailModel: Model<ImapEmailDocument>,
  ) {}

  onModuleInit() {
    this.connect();
  }

  private connect() {
    const imap = new Imap({
      user: process.env.IMAP_USER,
      password: process.env.IMAP_PASS,
      host: process.env.IMAP_HOST || 'imap.gmail.com',
      port: Number(process.env.IMAP_PORT) || 993,
      tls: true,
    });

    imap.once('ready', () => {
      console.log('📥 IMAP connected, watching inbox...');
      imap.openBox('INBOX', false, () => {
        imap.on('mail', () => this.fetchLatest(imap));
      });
    });

    imap.once('error', (err) => {
      console.error('❌ IMAP error:', err);
    });

    imap.connect();
  }

  private fetchLatest(imap: Imap) {
    imap.search(['UNSEEN'], (err, results) => {
      if (err || !results || results.length === 0) return;

      const f = imap.fetch(results.slice(-1), { bodies: '' });

      f.on('message', (msg) => {
        let buffer = '';
        let attributes: any;

        msg.on('body', (stream) => {
          stream.on('data', (chunk) => (buffer += chunk.toString()));
        });

        msg.on('attributes', (attrs) => {
          attributes = attrs;
        });

        msg.once('end', async () => {
          try {
            const parsed = await simpleParser(buffer);
            const emailData = {
  messageId: parsed.messageId || attributes.uid || '',
  subject: parsed.subject || '',
  from: parsed.from?.text || '',
  to: parsed.to?.text || '',
  receivingChain: buffer.match(/Received: .*/g) || [],
  esp: this.detectESP(parsed.headers.toString() + parsed.from?.text),
  rawHeaders: buffer,
  date: parsed.date || new Date(),
  seen: false,
  attachments: (parsed.attachments || []).map((a) => a.filename || ''),

  body: parsed.text || '',       // ✅ add plain text
  bodyHtml: parsed.html || '',   // ✅ add html version
};

            await new this.imapEmailModel(emailData).save();
            console.log(`✅ New email stored: ${parsed.subject}, ESP: ${emailData.esp}`);
          } catch (error) {
            console.error('❌ Error parsing email:', error);
          }
        });
      });
    });
  }

  async getAll(): Promise<ImapEmail[]> {
    return this.imapEmailModel.find().sort({ createdAt: -1 }).exec();
  }

  async getLatest(): Promise<ImapEmail | null> {
    return this.imapEmailModel.findOne().sort({ createdAt: -1 }).exec();
  }

  // Detect ESP type (basic heuristic)
  private detectESP(text: string): string {
    const t = text.toLowerCase();
    if (t.includes('google.com') || t.includes('gmail.com')) return 'Gmail';
    if (t.includes('outlook.com') || t.includes('hotmail.com') || t.includes('live.com')) return 'Outlook/Hotmail';
    if (t.includes('yahoo.com')) return 'Yahoo Mail';
    if (t.includes('zoho.com')) return 'Zoho Mail';
    if (t.includes('icloud.com') || t.includes('apple.com')) return 'Apple/iCloud';
    if (t.includes('amazonses.com')) return 'Amazon SES';
    if (t.includes('sendgrid.net')) return 'SendGrid';
    if (t.includes('protonmail.com')) return 'ProtonMail';
    return 'Unknown';
  }
}
