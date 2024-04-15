import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  WinstonModule,
  WINSTON_MODULE_NEST_PROVIDER,
  utilities as nestWinstonModuleUtilities,
} from "nest-winston";
import * as winston from "winston";
import { AppModule } from "./app.module";
import { AuthGuard } from "./auth.guard";
import { logger3 } from "./logger/logger3.middleware";
// import { SampleValidationPipe } from "./sample-validation.pipe";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // 부트스트래핑 과정(모듈, 프로바이더, DI 등의 초기화)에 Winston Logger 적용을 위함
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === "production" ? "info" : "silly",
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike("MyApp", {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
  });

  // middleware
  // app.use(logger3); // 전역 사용, class를 인수로 받을 수 없음

  // winston logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER)); // 전역 로거

  // guards
  // app.useGlobalGuards(new AuthGuard()); // guard 전역 적용

  // pipes
  // app.useGlobalPipes(new SampleValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // class-transformer 적용을 위함
    }),
  );

  await app.listen(3000);
}
bootstrap();
