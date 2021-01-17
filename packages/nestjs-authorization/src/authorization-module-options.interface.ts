import { Type } from '@nestjs/common';
import { PermissionProvider } from './permission.provider';

export interface AuthorizationModuleOptions {
  useClass: Type<PermissionProvider>;
}
