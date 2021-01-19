import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthorizationConfigService } from './authorization-config.service';
import { InMemoryPermissionProvider } from './in-memory-permission.provider';

@Module({
  imports: [UsersModule],
  providers: [AuthorizationConfigService, InMemoryPermissionProvider],
  controllers: [],
  exports: [AuthorizationConfigService, InMemoryPermissionProvider],
})
export class CommonModule {}
