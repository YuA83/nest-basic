import * as uuid from "uuid";
import { Injectable } from "@nestjs/common";
import { EmailService } from "src/email/email.service";

@Injectable()
export class UsersService {
  constructor(private emailService: EmailService) {}

  private async checkUserExists(email: string) {
    return false; // TODO: DB 연동
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    return; // TODO: DB 연동
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  async createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email);

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string) {
    /**
     * TODO
     * DB -> check token
     * Error or JWT
     */

    throw new Error("Method not implemented");
  }

  async login(email: string, password: string) {
    /**
     * TODO
     * DB -> check user
     * JWT
     */

    throw new Error("Method not implemented");
  }

  async getUserInfo(userId: string) {
    /**
     * TODO
     * DB -> check userId
     * return UserInfo
     */

    throw new Error("Method not implemented");
  }
}
