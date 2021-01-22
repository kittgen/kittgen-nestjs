import { ExecutionContext, Injectable } from '@nestjs/common';
import { Action } from '../actions/action';
import { Permission } from '../permissions/permission';
import { ConditionService } from './condition.service';

export interface ConditionContext {
  readonly permission: Permission | undefined;
  readonly action: Action;
}

export interface Condition {
  readonly id: string;
  check(
    ctx: ExecutionContext,
    conditionCtx: ConditionContext
  ): Promise<boolean>;
}

export type FunctionalCondition = (ctx: any) => boolean;

export const isFunctionalCondition = (
  condition: any
): condition is FunctionalCondition => {
  if (!condition) {
    return false;
  }
  // FIXME sloppy
  return Reflect.getOwnMetadataKeys(condition).length !== 2;
};

@Injectable()
export abstract class AbstractCondition implements Condition {
  constructor(conditionService: ConditionService) {
    conditionService.register(this);
  }

  get id() {
    return this.constructor.name;
  }

  abstract check(
    ctx: ExecutionContext,
    conditionCtx: ConditionContext
  ): Promise<boolean>;
}
