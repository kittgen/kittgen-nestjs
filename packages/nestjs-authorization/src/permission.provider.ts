import { DefaultPermissionSet } from './permission-set';

export interface PermissionProvider {
  getPermissionSet(ctx: any): Promise<DefaultPermissionSet>;
}

export abstract class AbstractPermissionProvider implements PermissionProvider {
  abstract getPermissionSet(ctx: any): Promise<DefaultPermissionSet>;
}
