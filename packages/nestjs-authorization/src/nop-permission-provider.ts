import { Permission } from './permission';
import { PermissionProvider } from './permission.provider';

export class NopPermissionProvider implements PermissionProvider {
  findPermissions(_user: any): Promise<Permission[]> {
    throw new Error('Method not implemented.');
  }
}
