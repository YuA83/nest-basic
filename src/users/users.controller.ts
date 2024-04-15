import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Headers,
  Inject,
} from "@nestjs/common";
import { Logger as WinstonLogger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { AuthGuard } from "src/auth.guard";
import { AuthService } from "src/auth/auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserLoginDto } from "./dto/user-login.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { UserInfo } from "./UserInfo";
import { UsersService } from "./users.service";

// @UseGuards(AuthGuard) // controller guard 적용
// @UseGuards(AuthGuard, SampleGuard) // 콤마를 통해서 연결
@Controller("users")
export class UsersController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  private printWinstonLog(dto) {
    this.logger.error(`eroror: ${dto}`);
    this.logger.warn(`warn: ${dto}`);
    this.logger.info(`info: ${dto}`);
    this.logger.http(`http: ${dto}`);
    this.logger.verbose(`verbose: ${dto}`);
    this.logger.debug(`debug: ${dto}`);
    this.logger.silly(`silly: ${dto}`);
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;

    this.printWinstonLog(dto);
    await this.usersService.createUser(name, email, password);
  }

  @Post("/email-verify")
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post("/login")
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  }

  @UseGuards(AuthGuard) // route guard
  @Get("/:id")
  async getUserInfo(@Param("id") userId: string): Promise<UserInfo> {
    return await this.usersService.getUserInfo(userId);
  }
}
