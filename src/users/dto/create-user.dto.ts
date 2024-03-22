import { BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { NotIn } from "src/utils/decorators/not-in";

export class CreateUserDto {
  // @Transform(({ value, obj }) => {
  //   // trim() : 공백처럼 보이는 유니코드 문자는 처리 불가
  //   if (obj.password.includes(value.trim()))
  //     throw new BadRequestException(
  //       "password는 name과 같은 문자열을 포함할 수 없습니다.",
  //     );

  //   return value.trim();
  // })
  @Transform((params) => params.value.trim())
  @NotIn("password", {
    message: "password는 name과 같은 문자열을 포함할 수 없습니다.",
  })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  readonly name: string;

  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}
