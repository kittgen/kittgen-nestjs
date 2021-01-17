import { DynamicModule, Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ConditionService } from './condition.service';
import { PERMISSION_PROVIDER } from './permission.provider';
import { AuthorizationModuleOptions } from './authorization-module-options.interface';

@Module({})
export class AuthorizationModule {
  static register({
    permissionProvider,
  }: AuthorizationModuleOptions): DynamicModule {
    return {
      module: AuthorizationModule,
      providers: [
        ConditionService,
        PermissionService,
        permissionProvider,
        {
          provide: PERMISSION_PROVIDER,
          useClass: permissionProvider,
        },
      ],
      exports: [ConditionService, PermissionService, PERMISSION_PROVIDER],
    };
  }
}
