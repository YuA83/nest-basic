import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.DATABACE_SYNCHRONIZE === 'true', // 소스코드 기반으로 DB 스키마 동기화, DB 연결될 때마다 초기화됨
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
