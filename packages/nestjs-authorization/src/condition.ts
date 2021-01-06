import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConditionsService } from './conditions.service';

@Injectable()
export abstract class Condition {
  constructor(conditionsService: ConditionsService) {
    conditionsService.register(this);
  }

  get id() {
    return this.constructor.name;
  }

  abstract check(ctx: ExecutionContext): Promise<boolean>;
}
