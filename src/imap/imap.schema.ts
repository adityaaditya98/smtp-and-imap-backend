import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImapEmailDocument = ImapEmail & Document;

@Schema({ timestamps: true })
export class ImapEmail {
  @Prop({ required: true })
  messageId: string;

  @Prop()
  subject: string;

  @Prop()
  from: string;

  @Prop()
  to: string;

  @Prop({ type: [String], default: [] })
  receivingChain: string[];

  @Prop({ default: 'Unknown' })
  esp: string;

  @Prop()
    body: string; // plain text content

    @Prop()
    bodyHtml: string; // html content

  @Prop()
  rawHeaders: string;

  @Prop()
  date: Date;

  @Prop({ default: false })
  seen: boolean;

  @Prop({ type: [String], default: [] })
  attachments: string[];
}

export const ImapEmailSchema = SchemaFactory.createForClass(ImapEmail);
