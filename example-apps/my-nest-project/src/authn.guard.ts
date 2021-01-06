import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

// TODO: dummy implementation to get user on request
@Injectable()
export class AuthnGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // attach authorized user information to request
    request.user = {
      id: request.query.userId,
    };
    return request.user.id !== undefined;
  }
}
