import * as uuid from "uuid";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { EmailService } from "src/email/email.service";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { DataSource, Repository } from "typeorm";
import { ulid } from "ulid";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private emailService: EmailService,
  ) {}

  private async checkUserExists(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    return user !== undefined;
  }

  /**
   *
   * Transaction 이용
   * DB에 변경이 일어나는 요청 독립적 분리
   * 에러 발생시 롤백하기 위함
   */

  // (1) transaction 사용
  private async saveUserUsingTransaction(
    name: string,
    email: string,
    passwors: string,
    signupVerifyToken: string,
  ) {
    // EntityManager를 콜백으로 받아서 수행
    await this.dataSource.transaction(async (manager) => {
      const user = new UserEntity();

      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = passwors;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }

  // (2) query runner 사용
  private async saveUserUsingQueryRunner(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect(); // DB 연결
    await queryRunner.startTransaction(); // transaction 실행

    try {
      const user = new UserEntity();

      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await queryRunner.manager.save(user); // persistence (영속화)
      await queryRunner.commitTransaction(); // 커밋을 통해 영속화 완료
    } catch (error) {
      // 에러 발생해도 인증 메일은 전송됨
      queryRunner.rollbackTransaction(); // 롤백
    } finally {
      queryRunner.release(); // 객체 해제
    }
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const user = new UserEntity();

    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;

    await this.userRepository.save(user);
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);

    if (userExist)
      throw new UnprocessableEntityException(
        "해당 이메일로는 가입할 수 없습니다.",
      );

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
