import { ExecutionContext } from '@nestjs/common';

export class AuthGuard {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    return !!request.currentUser;
  }
}
