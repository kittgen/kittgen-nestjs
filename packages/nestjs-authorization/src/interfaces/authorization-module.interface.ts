import { Abstract, ModuleMetadata, Provider, Type } from '@nestjs/common';
import { PermissionProvider } from '../permission.provider';

export interface AuthorizationOptionsFactory {
  createOptions(): Promise<AuthorizationOptions> | AuthorizationOptions;
}

export interface AuthorizationOptions {
  permissionProvider: PermissionProvider;
}

export interface AuthorizationModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  inject?: Array<Type<any> | string | symbol | Abstract<any> | Function>;
  extraProviders?: Provider[];
  useExisting?: Type<AuthorizationOptionsFactory>;
  useClass?: Type<AuthorizationOptionsFactory>;
  useFactory?: (
    ...args: any
  ) => AuthorizationOptions | Promise<AuthorizationOptions>;
}
