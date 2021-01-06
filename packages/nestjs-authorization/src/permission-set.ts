import { ExecutionContext } from '@nestjs/common';
import { Permission } from './permission';

const filterAsync = async (arr: any[], pred: (el: any) => Promise<boolean>) => {
  const results = await Promise.all(arr.map(pred));
  return arr.filter((_v, index) => results[index]);
};

export class PermissionSet {
  constructor(readonly permissions: Permission[] = []) {}

  add(permissions: Permission[]) {
    this.permissions.push(...permissions);
    return this;
  }

  async isAllowed(actions: string[], ctx: ExecutionContext): Promise<boolean> {
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
    action: string,
    ctx: ExecutionContext
  ): Promise<boolean> {
    if (permission.action !== action) {
      return false;
    }
    if (permission.condition) {
      return await permission.condition.check(ctx);
    }
    return true;
  }
}
