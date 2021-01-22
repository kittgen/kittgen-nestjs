import { DynamicModule, Module } from '@nestjs/common';
import { PermissionService } from './permissions/permission.service';
import { ConditionService } from './conditions/condition.service';
import { AuthorizationModuleAsyncOptions } from './authorization-module.interface';
import { AuthorizationCoreModule } from './authorization-core.module';
@Module({
  providers: [ConditionService, PermissionService],
  exports: [ConditionService, PermissionService],
})
export class AuthorizationModule {
  static registerAsync(
    options: AuthorizationModuleAsyncOptions
  ): DynamicModule {
    return {
      module: AuthorizationModule,
      imports: [AuthorizationCoreModule.registerAsync(options)],
    };
  }
}
