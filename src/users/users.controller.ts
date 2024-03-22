import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserLoginDto } from "./dto/user-login.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { UserInfo } from "./UserInfo";
import { UsersService } from "./users.service";

// @UseGuards(AuthGuard) // controller guard 적용
// @UseGuards(AuthGuard, SampleGuard) // 콤마를 통해서 연결
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @UseGuards(AuthGuard) // route guard
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;

    await this.usersService.createUser(name, email, password);
  }

  @Post("/email-verify")
  // async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<void> {
    const { signupVerifyToken } = dto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post("/login")
  // async login(@Body() dto: UserLoginDto): Promise<string> {
  async login(@Body() dto: UserLoginDto): Promise<void> {
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  }

  @Get("/:id")
  // async getUserInfo(@Param("id") userId: string): Promise<UserInfo> {
  async getUserInfo(@Param("id") userId: string): Promise<void> {
    return await this.usersService.getUserInfo(userId);
  }
}
