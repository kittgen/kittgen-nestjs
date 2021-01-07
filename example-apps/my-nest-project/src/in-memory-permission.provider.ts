import { Injectable } from '@nestjs/common';
import { Permission } from '@kittgen/nestjs-authorization';
import { AbstractPermissionProvider, PermissionSet } from '@kittgen/nestjs-authorization';

@Injectable()
export class InMemoryPermissionProvider extends AbstractPermissionProvider {
  async getPermissionSetForUser(user: any): Promise<PermissionSet> {
    if (user.id === 'uid-1') {
      return Promise.resolve(new PermissionSet([new Permission('read-article')]));
    }
    return Promise.resolve(new PermissionSet([
      new Permission('read-article'),
      new Permission('update-article'),
    ]));
  }
}
