import { Module } from '@nestjs/common';
import { ConditionService } from './condition.service';

@Module({
  imports: [],
  providers: [ConditionService],
  exports: [ConditionService],
})
export class AuthorizationModule {}
