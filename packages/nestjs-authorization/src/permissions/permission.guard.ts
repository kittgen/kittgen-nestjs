import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  mixin,
} from '@nestjs/common';
import { AuthorizationModuleOptions } from '../authorization-module.interface';
import { Action } from '../actions/action';
import { PermissionService } from './permission.service';
import { PermissionProvider } from './permission.provider';
import { AUTHORIZATION_MODULE_OPTIONS } from '../authorization.constants';

export const PermissionGuard = (...actions: Action[]) => {
  @Injectable()
  class PermissionGuardImpl implements CanActivate {
    private provider: PermissionProvider;

    constructor(
      @Inject(AUTHORIZATION_MODULE_OPTIONS)
      options: AuthorizationModuleOptions,
      private permissionService: PermissionService
    ) {
      this.provider = options.permissionProvider;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      const permissionSet = await this.provider.getPermissionSet(req);
      return this.permissionService.areAllowed(actions, permissionSet, context);
    }
  }

  return mixin(PermissionGuardImpl) as any;
};
