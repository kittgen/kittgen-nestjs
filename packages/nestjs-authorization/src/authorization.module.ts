import { DynamicModule, Module } from '@nestjs/common';
import { AuthorizationModuleAsyncOptions } from './authorization-module.interface';
import { AuthorizationCoreModule } from './authorization-core.module';
@Module({})
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
