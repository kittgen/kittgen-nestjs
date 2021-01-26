import { CheckPermission } from '@kittgen/nestjs-authorization';
import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor() {}

  @CheckPermission('hello-world')
  @Get()
  async hello() {
    return 'World!';
  }
}
