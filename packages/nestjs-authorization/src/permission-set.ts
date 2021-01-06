import { ExecutionContext } from '@nestjs/common';
import { Action } from './action';
import { Permission } from './permission';

const filterAsync = async (arr: any[], pred: (el: any) => Promise<boolean>) => {
  const results = await Promise.all(arr.map(pred));
  return arr.filter((_v, index) => results[index]);
};

export interface PermissionSet {
  add(permissions: Permission[]): void
  isAllowed(actions: Action[], ctx: ExecutionContext): Promise<boolean>
  checkPermission(permission: Permission, action: Action, ctx: ExecutionContext): Promise<boolean>
}

export class DefaultPermissionSet implements PermissionSet{
  constructor(readonly permissions: Permission[] = []) {}

  add(permissions: Permission[]) {
    this.permissions.push(...permissions);
    return this;
  }

  async isAllowed(actions: Action[], ctx: ExecutionContext): Promise<boolean> {
    const granted = await filterAsync(actions, async action => {
      const matchingPermissions = await filterAsync(
        this.permissions,
        permission => this.checkPermission(permission, action, ctx)
      );
      return matchingPermissions.length > 0;
    });
    return actions.length === granted.length;
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
      return await permission.condition.check(ctx, {permission, action});
    }
    return true;
  }
}
