import { DynamicModule, Global, Provider, Type } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { AUTHORIZATION_MODULE_OPTIONS } from './authorization.constants';
import { ConditionService } from './conditions/condition.service';
import {
  AuthorizationModuleAsyncOptions,
  AuthorizationOptionsFactory,
} from './authorization-module.interface';
import { PermissionService } from './permissions/permission.service';

@Global()
@Module({})
export class AuthorizationCoreModule {
  static registerAsync(
    options: AuthorizationModuleAsyncOptions
  ): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: AuthorizationCoreModule,
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
