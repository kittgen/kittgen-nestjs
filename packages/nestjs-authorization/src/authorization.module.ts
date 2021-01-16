import { DynamicModule, Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ConditionService } from './condition.service';
import { PERMISSION_PROVIDER } from './permission.provider';
import { AuthorizationModuleOptions } from './authorization-module-options.interface';

@Module({})
export class AuthorizationModule {
  private static module: DynamicModule;

  static register({
    permissionProvider,
  }: AuthorizationModuleOptions): DynamicModule {
    this.module = {
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
    return this.module;
  }

  static use() {
    return this.module;
  }
}
