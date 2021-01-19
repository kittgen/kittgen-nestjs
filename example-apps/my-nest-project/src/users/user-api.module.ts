import { AuthorizationModule } from '@kittgen/nestjs-authorization';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthorizationConfigService } from '../common/authorization-config.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    AuthorizationModule.registerAsync({
      imports: [CommonModule],
      // useExisting: AuthorizationConfigService,
      // or
      useClass: AuthorizationConfigService,
    }),
  ],
  providers: [],
  controllers: [UsersController],
  exports: [],
})
export class UsersApiModule {}
