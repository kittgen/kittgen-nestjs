import {
  Abstract,
  DynamicModule,
  ForwardReference,
  Module,
  Type,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ConditionService } from './condition.service';
import { PermissionProvider, PERMISSION_PROVIDER } from './permission.provider';
import { AuthorizationModuleOptions } from './authorization-module-options.interface';

@Module({})
export class AuthorizationModule {
  static register({ useClass }: AuthorizationModuleOptions): DynamicModule {
    return {
      module: AuthorizationModule,
      providers: [
        ConditionService,
        PermissionService,
        useClass,
        {
          provide: PERMISSION_PROVIDER,
          useClass,
        },
      ],
      exports: [ConditionService, PermissionService, PERMISSION_PROVIDER],
    };
  }

  static registerAsync(options: {
    imports?: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >;
    inject?: Array<Type<any> | string | symbol | Abstract<any> | Function>;
    useFactory: (
      ...args: any
    ) => PermissionProvider | Promise<PermissionProvider>;
  }) {
    const provider = {
      provide: PERMISSION_PROVIDER,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      imports: [...(options.imports || [])],
      module: AuthorizationModule,
      providers: [ConditionService, PermissionService, provider],
      exports: [ConditionService, PermissionService, PERMISSION_PROVIDER],
    };
  }
}
