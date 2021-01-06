import { DefaultPermissionSet } from 'permission-set';

export interface PermissionProvider {
  getPermissionSetForUser(user: any): Promise<DefaultPermissionSet>;
}

export abstract class AbstractPermissionProvider implements PermissionProvider {
  abstract getPermissionSetForUser(user: any): Promise<DefaultPermissionSet>;
}
