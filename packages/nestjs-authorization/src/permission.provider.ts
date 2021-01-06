import { PermissionSet } from 'permission-set';

export interface PermissionProvider {
  getPermissionSetForUser(user: any) : Promise<PermissionSet>
}

export abstract class AbstractPermissionProvider implements PermissionProvider {
  abstract getPermissionSetForUser(user: any): Promise<PermissionSet>;
}
