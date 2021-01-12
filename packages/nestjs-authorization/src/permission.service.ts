import { ExecutionContext, Injectable } from '@nestjs/common';
import { isFunctionalCondition } from './condition';
import { Action } from './action';
import { ConditionService } from './condition.service';
import { PermissionSet } from './permission-set';

@Injectable()
export class PermissionService {
  constructor(private conditionService: ConditionService) {}

  async areAllowed(
    actions: Action[],
    permissionSet: PermissionSet,
    context: ExecutionContext
  ) {
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
