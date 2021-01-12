import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  mixin,
} from '@nestjs/common';
import { isFunctionalCondition } from './condition';
import { Action } from './action';
import { PermissionProvider } from './permission.provider';
import { ConditionService } from './condition.service';

export const PermissionGuard = (actions: Action[]) => {
  @Injectable()
  class PermissionGuardImpl implements CanActivate {
    constructor(
      @Inject('PERMISSION_PROVIDER')
      private permissionProvider: PermissionProvider,
      private conditionService: ConditionService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      const permissionSet = await this.permissionProvider.getPermissionSet(req);
      const result = actions.reduce(async (isAllowedPromise, action) => {
        const isAllowed = await isAllowedPromise;
        if (isAllowed) {
          return Promise.resolve(true);
        }

        if (typeof action === 'string') {
          return await permissionSet.isAllowed(action, context);
        }

        if (action.condition === undefined) {
          return await permissionSet.isAllowed(action.name, context);
        }

        // conditional action by function
        if (isFunctionalCondition(action.condition)) {
          return action.condition(context)
            ? await permissionSet.isAllowed(action.name, context)
            : false;
        }

        // conditional action by type
        const condition = await this.conditionService.findByType(
          action.condition
        );
        if (
          condition &&
          (await condition.check(context, {
            action: action.name,
            permission: undefined,
          }))
        ) {
          return await permissionSet.isAllowed(action.name, context);
        }

        return false;
      }, Promise.resolve(false));
      return await result;
    }
  }

  return mixin(PermissionGuardImpl) as any;
};
