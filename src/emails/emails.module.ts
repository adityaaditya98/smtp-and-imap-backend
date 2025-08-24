import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Email, EmailSchema } from "./emails.schema";
import { EmailsService } from "./emails.service";
import { EmailsController } from "./emails.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Email.name, schema: EmailSchema }]),
  ],
  providers: [EmailsService],
  controllers: [EmailsController],
  exports: [EmailsService],
})
export class EmailsModule {}