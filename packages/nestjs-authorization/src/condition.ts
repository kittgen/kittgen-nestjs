import { ExecutionContext, Injectable } from '@nestjs/common';
import { Action } from './action';
import { Permission } from './permission';
import { ConditionsService } from './conditions.service';

export interface ConditionContext {
  readonly permission: Permission;
  readonly action: Action;
}

export interface Condition {
  id: string;
  check(
    ctx: ExecutionContext,
    conditionCtx: ConditionContext
  ): Promise<boolean>;
}

@Injectable()
export abstract class AbstractCondition implements Condition {
  constructor(conditionsService: ConditionsService) {
    conditionsService.register(this);
  }

  get id() {
    return this.constructor.name;
  }

  abstract check(
    ctx: ExecutionContext,
    conditionCtx: ConditionContext
  ): Promise<boolean>;
}
