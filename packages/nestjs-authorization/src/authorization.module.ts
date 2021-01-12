import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ConditionService } from './condition.service';

@Module({
  imports: [],
  providers: [ConditionService, PermissionService],
  exports: [ConditionService, PermissionService],
})
export class AuthorizationModule {}
