import { PermissionSet } from 'permission-set';
import { AbstractPermissionProvider } from './permission.provider';

export class NoopPermissionProvider implements AbstractPermissionProvider {
  getPermissionSetForUser(_user: any): Promise<PermissionSet> {
    return Promise.resolve(new PermissionSet())
  }
}
