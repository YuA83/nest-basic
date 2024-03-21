import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailModule } from "src/email/email.module";
import { UserEntity } from "./entity/user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), EmailModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
