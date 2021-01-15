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

export const createAction = (name: string) => new ActionBuilder(name);

export const body = (predicate: (body: any) => boolean) => (
  ctx: ExecutionContext
) => predicate(ctx.switchToHttp().getRequest().body);

export const params = (predicate: (params: any) => boolean) => (
  ctx: ExecutionContext
) => predicate(ctx.switchToHttp().getRequest().params);

export const query = (predicate: (query: any) => boolean) => (
  ctx: ExecutionContext
) => predicate(ctx.switchToHttp().getRequest().query);

export type Action = string | ActionBuilder;
