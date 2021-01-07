import { DefaultPermissionSet } from 'permission-set';
import { AbstractPermissionProvider } from './permission.provider';

export class NoopPermissionProvider implements AbstractPermissionProvider {
  getPermissionSet(_user: any): Promise<DefaultPermissionSet> {
    return Promise.resolve(new DefaultPermissionSet());
  }
}
