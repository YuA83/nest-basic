import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { EmailModule } from "src/email/email.module";
import { UserEntity } from "./entity/user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    EmailModule,
    AuthModule,
    Logger,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
