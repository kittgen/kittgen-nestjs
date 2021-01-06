import { Permission } from './permission';

export abstract class PermissionProvider {
  abstract findPermissions(user: any): Promise<Permission[]>;
}
