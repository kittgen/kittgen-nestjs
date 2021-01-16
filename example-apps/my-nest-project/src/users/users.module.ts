import { AuthorizationModule } from '@kittgen/nestjs-authorization';
import { Module } from '@nestjs/common';
import { InMemoryPermissionProvider } from '../in-memory-permission.provider';
import { UsersController } from './users.controller';
@Module({
  imports: [
    AuthorizationModule.register({
      permissionProvider: InMemoryPermissionProvider,
    }),
  ],
  controllers: [UsersController],
  exports: [],
})
export class UsersModule {}
