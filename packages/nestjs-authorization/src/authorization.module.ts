import { Module } from '@nestjs/common';
import { ConditionsService } from './conditions.service';

@Module({
  imports: [],
  providers: [ConditionsService],
  exports: [ConditionsService],
})
export class AuthorizationModule {}
