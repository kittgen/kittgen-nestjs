import { AuthorizationModule } from '@kittgen/nestjs-authorization';
import { Module } from '@nestjs/common';
import { AuthorizationConfigService } from '../common/authorization-config.service';
import { CommonModule } from '../common/common.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
@Module({
  imports: [
    AuthorizationModule.registerAsync({
      imports: [CommonModule],
      // useExisting: AuthorizationConfigService,
      // or
      useClass: AuthorizationConfigService,
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
