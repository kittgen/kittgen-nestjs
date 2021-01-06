import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
} from '@nestjs/common';
import { PermissionProvider } from './permission.provider';
import { PermissionSet } from './permission-set';

export const AuthActionGuard = (actions: string[]) => {
  @Injectable()
  class AuthActionGuardImpl implements CanActivate {
    constructor(private permissionProvider: PermissionProvider) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      const permissionsOfUser = await this.permissionProvider.findPermissions(
        req.user
      );
      const permissionSet = new PermissionSet(permissionsOfUser);
      return permissionSet.isAllowed(actions, context);
    }
  }

  return mixin(AuthActionGuardImpl) as any;
};
