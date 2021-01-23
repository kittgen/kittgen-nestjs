import { Injectable } from '@nestjs/common';
import {
  AbstractPermissionProvider,
  SimplePermissionSet,
  PermissionSet,
  SimplePermission,
} from '@kittgen/nestjs-authorization';
import { UsersService } from '../users/users.service';
import { UserAction } from '../users/actions';

@Injectable()
export class InMemoryPermissionProvider extends AbstractPermissionProvider {
  constructor(private userService: UsersService) {
    super();
  }

  async getPermissionSet(req: any): Promise<PermissionSet> {
    if (req.user.id === 'uid-1') {
      return Promise.resolve(
        new SimplePermissionSet(
          new SimplePermission(UserAction.CanCreate),
          new SimplePermission(UserAction.CanEdit),
        ),
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
