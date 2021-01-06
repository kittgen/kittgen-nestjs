import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
} from '@nestjs/common';
import { Action } from './action';
import { PermissionProvider } from './permission.provider';

export const AuthActionGuard = (actions: Action[]) => {
  @Injectable()
  class AuthActionGuardImpl implements CanActivate {
    constructor(private permissionProvider: PermissionProvider) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      const permissionSet = await this.permissionProvider.getPermissionSetForUser(
        req.user
      );
      return permissionSet.areAllowed(actions, context);
    }
  }

  return mixin(AuthActionGuardImpl) as any;
};
