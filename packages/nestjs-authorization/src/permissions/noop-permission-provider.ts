import { PermissionSet, SimplePermissionSet } from './permission-set';
import { AbstractPermissionProvider } from './permission.provider';

export class NoopPermissionProvider implements AbstractPermissionProvider {
  getPermissionSet(_user: any): Promise<PermissionSet> {
    return Promise.resolve(new SimplePermissionSet());
  }
}
