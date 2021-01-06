import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthActionGuard } from './auth-action.guard';

export function AuthAction(permissions: string[]) {
  return applyDecorators(UseGuards(AuthActionGuard(permissions)));
}
