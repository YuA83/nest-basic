import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
// import { SampleValidationPipe } from "./sample-validation.pipe";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalPipes(new SampleValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // class-transformer 적용을 위함
    }),
  );

  await app.listen(3000);
}
bootstrap();
