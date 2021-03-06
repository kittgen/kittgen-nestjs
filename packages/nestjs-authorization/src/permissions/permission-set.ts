import { ExecutionContext } from '@nestjs/common';
import { Action } from '../actions/action';
import { Permission } from './permission';

const filterAsync = async (arr: any[], pred: (el: any) => Promise<boolean>) => {
  const results = await Promise.all(arr.map(pred));
  return arr.filter((_v, index) => results[index]);
};

export interface PermissionSet {
  add(...permissions: Permission[]): void;
  areAllowed(actions: Action[], ctx: ExecutionContext): Promise<boolean>;
  isAllowed(action: Action, ctx: ExecutionContext): Promise<boolean>;
  checkPermission(
    permission: Permission,
    action: Action,
    ctx: ExecutionContext
  ): Promise<boolean>;
}

export class SimplePermissionSet implements PermissionSet {
  readonly permissions: Permission[];

  constructor(...permissions: (Permission | Permission[])[]) {
    this.permissions = permissions.flat();
  }

  add(...permissions: (Permission | Permission[])[]) {
    this.permissions.push(...permissions.flat());
    return this;
  }

  async areAllowed(actions: Action[], ctx: ExecutionContext): Promise<boolean> {
    const granted = await filterAsync(actions, async action => {
      const matchingPermissions = await filterAsync(
        this.permissions,
        permission => this.checkPermission(permission, action, ctx)
      );
      return matchingPermissions.length > 0;
    });
    return actions.length === granted.length;
  }

  async isAllowed(action: Action, ctx: ExecutionContext): Promise<boolean> {
    return this.areAllowed([action], ctx);
  }

  async checkPermission(
    permission: Permission,
    action: Action,
    ctx: ExecutionContext
  ): Promise<boolean> {
    if (permission.action !== action) {
      return false;
    }
    if (permission.condition) {
      return await permission.condition.check(ctx, { permission, action });
    }
    return true;
  }
}
