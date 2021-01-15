import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  mixin,
} from '@nestjs/common';
import { Action } from './action';
import { PermissionProvider, PERMISSION_PROVIDER } from './permission.provider';
import { PermissionService } from './permission.service';

export const PermissionGuard = (...actions: Action[]) => {
  @Injectable()
  class PermissionGuardImpl implements CanActivate {
    constructor(
      @Inject(PERMISSION_PROVIDER)
      private permissionProvider: PermissionProvider,
      private permissionService: PermissionService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      const permissionSet = await this.permissionProvider.getPermissionSet(req);
      return this.permissionService.areAllowed(actions, permissionSet, context);
    }
  }

  return mixin(PermissionGuardImpl) as any;
};
