import { createAction } from '@kittgen/nestjs-authorization';

export class UserAction {
  static CanCreate = createAction('user-create');
  static CanEdit = createAction('user-edit');
}
