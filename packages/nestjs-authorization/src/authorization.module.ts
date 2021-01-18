import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ConditionService } from './condition.service';
import {
  AuthorizationModuleAsyncOptions,
  AuthorizationOptionsFactory,
} from './interfaces/authorization-module.interface';
import { AUTHORIZATION_MODULE_OPTIONS } from './authorization.constants';
@Module({
  providers: [ConditionService, PermissionService],
  exports: [ConditionService, PermissionService],
})
export class AuthorizationModule {
  static registerAsync(
    options: AuthorizationModuleAsyncOptions
  ): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);
    return {
      global: options.isGlobal,
      module: AuthorizationModule,
      imports: [...(options.imports || [])],
      providers: [
        ...asyncProviders,
        ConditionService,
        PermissionService,
        ...(options.extraProviders || []),
      ],
      exports: [ConditionService, PermissionService, ...asyncProviders],
    };
  }

  /**
   * Returns the asynchrnous providers depending on the given module
   * options
   * @param options Options for the asynchrnous terminus module
   */
  private static createAsyncProviders(
    options: AuthorizationModuleAsyncOptions
  ): Provider[] {
    if (options.useFactory || options.useExisting) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<AuthorizationOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
        inject: [...(options.inject || [])],
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: AuthorizationModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: AUTHORIZATION_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: AUTHORIZATION_MODULE_OPTIONS,
      useFactory: async (optionsFactory: AuthorizationOptionsFactory) =>
        optionsFactory.createOptions(),
      inject: [(options.useExisting || options.useClass)!],
    };
  }
}
