import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConditionsService } from './conditions.service';

export interface Condition {
  
  id: string

  check(ctx: ExecutionContext) : Promise<boolean>
}

@Injectable()
export abstract class AbstractCondition implements Condition {
  constructor(conditionsService: ConditionsService) {
    conditionsService.register(this);
  }

  get id() {
    return this.constructor.name;
  }

  abstract check(ctx: ExecutionContext): Promise<boolean>;
}
