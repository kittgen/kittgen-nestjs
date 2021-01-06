import { Injectable } from '@nestjs/common';
import { Permission } from '@kittgen/nestjs-authorization';
import { PermissionProvider } from '@kittgen/nestjs-authorization';

@Injectable()
export class InMemoryPermissionProvider extends PermissionProvider {
  async findPermissions(user: any): Promise<Permission[]> {
    if (user.id === 'uid-1') {
      return Promise.resolve([new Permission('read-article')]);
    }
    return Promise.resolve([
      new Permission('read-article'),
      new Permission('update-article'),
    ]);
  }
}
