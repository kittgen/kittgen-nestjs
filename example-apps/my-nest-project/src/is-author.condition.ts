import { ExecutionContext, Injectable } from '@nestjs/common';
import {
  AbstractCondition,
  ConditionsService,
  ConditionContext
} from '@kittgen/nestjs-authorization';

@Injectable()
export class IsAuthor extends AbstractCondition {
  constructor(
    conditionService: ConditionsService,
  ) {
    super(conditionService);
  }

  async check(ctx: ExecutionContext, conditionCtx: ConditionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    console.log(typeof req.body.authorId)
    console.log(req.body.authorId === 1);
    return req.body.authorId === 1;
  }
}
