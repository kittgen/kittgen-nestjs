import { AuthorizationModule } from '@kittgen/nestjs-authorization';
import { Module } from '@nestjs/common';
import { InMemoryPermissionProvider } from '../in-memory-permission.provider';
import { UsersController } from './users.controller';
@Module({
  imports: [
    //AuthorizationModule.register({
    //  useClass: InMemoryPermissionProvider,
    //}),
    AuthorizationModule.registerAsync({
      useFactory: async () => new InMemoryPermissionProvider(),
    }),
  ],
  controllers: [UsersController],
  exports: [AuthorizationModule],
})
export class UsersModule {}
