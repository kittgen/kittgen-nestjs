import { ExecutionContext, Type } from '@nestjs/common';
import { Condition } from './condition';

export class ActionBuilder {
  constructor(
    readonly name: string,
    public condition?: ((dto: any) => boolean) | Type<Condition>
  ) {}
  if(
    condition: ((ctx: ExecutionContext) => boolean) | Type<Condition>
  ): ActionBuilder {
    this.condition = condition;
    return this;
  }
}

export const CreateAction = (name: string) => new ActionBuilder(name);

export type Action = string | ActionBuilder;
