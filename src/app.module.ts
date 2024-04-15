import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { EmailModule } from "./email/email.module";
import { validationSchema } from "./config/validationSchema";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoggerMiddleware } from "./logger/logger.middleware";
import { Logger2Middleware } from "./logger/logger2.middleware";
import { UsersController } from "./users/users.controller";
import { AuthService } from "./auth/auth.service";
import { AuthModule } from "./auth/auth.module";
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from "nest-winston";
import * as winston from "winston";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [`${__dirname}/**/*.entity.{ts,js}`],
      synchronize: process.env.DATABASE_SYNCHRONIZE === "true", // 코드 기반 DB 동기화 (true => 실행마다 초기화)
    }),
    WinstonModule.forRoot({
      /**
       * [ 내장 Logger Level ]
       * debug: 0 => low
       * verbose: 1
       * log: 2
       * warn: 3
       * error: 4 => high
       *
       * [ Winston Log Level ]
       * error: 0 => high
       * warn: 1
       * info: 2
       * http: 3
       * verbose: 4
       * debug: 5
       * silly: 6 => low
       */
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === "production" ? "info" : "silly", // log level
          format: winston.format.combine(
            winston.format.timestamp(), // 시간 같이 표시
            nestWinstonModuleUtilities.format.nestLike("MyApp", {
              // appName: "MyApp", 어디서 로그를 남겼는지 표시
              prettyPrint: true, // 출력 프리티
            }),
          ),
        }),
      ],
    }),
    UsersModule,
    EmailModule,
    AuthModule,
  ],
  controllers: [],
  providers: [AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(LoggerMiddleware, Logger2Middleware)
      // .exclude({path: "/users", method: RequestMethod.GET}) // GET /users 일때 해당 미들웨어 무시됨
      // .forRoutes("/users"); // 문자열 형식
      .forRoutes(UsersController); // 컨트롤러 클래스 형식 (일반적으로 사용하는 방법)
  }
}
