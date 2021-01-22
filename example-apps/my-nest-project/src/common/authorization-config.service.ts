import {
  AuthorizationModuleOptions,
  AuthorizationOptionsFactory,
} from '@kittgen/nestjs-authorization';
import { Injectable } from '@nestjs/common';
import { InMemoryPermissionProvider } from './in-memory-permission.provider';

@Injectable()
export class AuthorizationConfigService implements AuthorizationOptionsFactory {
  constructor(readonly provider: InMemoryPermissionProvider) {}

  createOptions():
    | AuthorizationModuleOptions
    | Promise<AuthorizationModuleOptions> {
    return {
      permissionProvider: this.provider,
    };
  }
}
