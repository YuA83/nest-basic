import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import emailConfig from "src/config/emailConfig";
import { EmailService } from "./email.service";

@Module({
  imports: [ConfigModule.forFeature(emailConfig)],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
