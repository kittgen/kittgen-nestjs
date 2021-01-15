import { AuthorizationModule } from '@kittgen/nestjs-authorization';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';

@Module({
  imports: [
    AuthorizationModule
  ],
  controllers: [UsersController]
})
export class UsersModule { }
