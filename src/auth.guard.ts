import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "./auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  // guard는 CanActive 인터페이스 구현해야 함

  constructor(private authService: AuthService) {}

  private validateRequest(request: Request) {
    // 서비스 내부 규칙에 따라 인가 로직 작성
    const jwtString = request.headers.get("authorization").split("Bearer ")[1];

    this.authService.verify(jwtString);

    return true; // false => 403 error
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    /**
     * 현재 http로 기능을 제공하고 있음 => switchToHttp() 사용
     */
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }
}
