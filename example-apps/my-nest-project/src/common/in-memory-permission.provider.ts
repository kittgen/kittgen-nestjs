import { Injectable } from '@nestjs/common';
import {
  AbstractPermissionProvider,
  SimplePermissionSet,
  PermissionSet,
  SimplePermission,
} from '@kittgen/nestjs-authorization';
import { UsersService } from '../users/users.service';

@Injectable()
export class InMemoryPermissionProvider extends AbstractPermissionProvider {
  constructor(private userService: UsersService) {
    super();
  }

  async getPermissionSet(req: any): Promise<PermissionSet> {
    if (req.user.id === 'uid-1') {
      return Promise.resolve(
        new SimplePermissionSet(new SimplePermission('read-article')),
      );
    }
    if (req.user.id === 'uid-2') {
      return Promise.resolve(
        new SimplePermissionSet(
          new SimplePermission('read-article'),
          new SimplePermission('write-article'),
        ),
      );
    }
    return Promise.resolve(
      new SimplePermissionSet(new SimplePermission('hello-world')),
    );
  }
}
