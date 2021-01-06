import { applyDecorators, UseGuards } from '@nestjs/common';
import { Action } from './action';
import { AuthActionGuard } from './auth-action.guard';

export function AuthAction(actions: Action[]) {
  return applyDecorators(UseGuards(AuthActionGuard(actions)));
}
