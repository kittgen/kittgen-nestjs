import {
  AuthorizationOptions,
  AuthorizationOptionsFactory,
} from '@kittgen/nestjs-authorization';
import { Injectable } from '@nestjs/common';
import { InMemoryPermissionProvider } from './in-memory-permission.provider';

@Injectable()
export class AuthorizationConfigService implements AuthorizationOptionsFactory {
  constructor(readonly provider: InMemoryPermissionProvider) {}

  createOptions(): AuthorizationOptions | Promise<AuthorizationOptions> {
    return {
      isGlobal: true,
      permissionProvider: this.provider,
    };
  }
}
