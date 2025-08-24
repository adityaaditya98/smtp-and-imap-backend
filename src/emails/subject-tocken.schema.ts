import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type SubjectTokenDocument = HydratedDocument<SubjectToken>;


@Schema({ timestamps: true })
export class SubjectToken {
@Prop({ unique: true }) token: string; // e.g., LG-2F3C6E
@Prop() description?: string;
@Prop({ default: true }) active: boolean;
}


export const SubjectTokenSchema = SchemaFactory.createForClass(SubjectToken);