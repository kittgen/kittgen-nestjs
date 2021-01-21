import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  async doNothing(user: any): Promise<void> {}
}
