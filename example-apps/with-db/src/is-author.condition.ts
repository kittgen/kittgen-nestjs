import { ExecutionContext, Injectable } from '@nestjs/common';
import {
  AbstractCondition,
  ConditionService,
  ConditionContext,
} from '@kittgen/nestjs-authorization';

@Injectable()
export class IsAuthor extends AbstractCondition {
  constructor(conditionService: ConditionService) {
    super(conditionService);
  }

  async check(
    ctx: ExecutionContext,
    conditionCtx: ConditionContext,
  ): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    return req.body.authorId === 1;
  }
}
