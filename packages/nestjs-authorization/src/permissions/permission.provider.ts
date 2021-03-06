import { PermissionSet } from './permission-set';

export interface PermissionProvider {
  getPermissionSet(ctx: any): Promise<PermissionSet>;
}

export abstract class AbstractPermissionProvider implements PermissionProvider {
  abstract getPermissionSet(ctx: any): Promise<PermissionSet>;
}
