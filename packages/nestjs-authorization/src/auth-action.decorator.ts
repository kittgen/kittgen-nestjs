import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthActionGuard } from './auth-action.guard';

export function AuthAction(actions: string[]) {
  return applyDecorators(UseGuards(AuthActionGuard(actions)));
}
