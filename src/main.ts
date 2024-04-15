import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { AppModule } from "./app.module";
import { AuthGuard } from "./auth.guard";
import { logger3 } from "./logger/logger3.middleware";
// import { SampleValidationPipe } from "./sample-validation.pipe";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
