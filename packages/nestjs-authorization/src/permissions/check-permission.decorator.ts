import { applyDecorators, UseGuards } from '@nestjs/common';
import { Action } from '../actions/action';
import { PermissionGuard } from './permission.guard';

export function CheckPermission(...actions: Action[]) {
  return applyDecorators(UseGuards(PermissionGuard(...actions)));
}
