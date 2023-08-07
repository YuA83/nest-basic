import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';

//https://suloth.tistory.com/22
@Module({
  imports: [
    UsersModule,
    EmailModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig],
      isGlobal: true, // 전역 모듈로 등록하여 어느 모듈에서나 사용 가능
      validationSchema, // joi를 이용한 유효성 검사
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
