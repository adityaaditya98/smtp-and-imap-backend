import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmailDocument = Email & Document;

@Schema({ timestamps: true })
export class Email {
  @Prop() messageId: string;
  @Prop() subject: string;
  @Prop() from: string;
  @Prop() to: string;
  @Prop([String]) receivingChain: string[];
  @Prop() esp: string;
  @Prop() rawHeaders: string;
}

export const EmailSchema = SchemaFactory.createForClass(Email);
