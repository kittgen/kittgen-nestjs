import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  Inject,
  Injectable,
  Optional,
  Scope,
} from '@nestjs/common';
import { ClassTransformOptions } from 'class-transformer';
import { Observable, from } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { REQUEST } from '@nestjs/core';
import { Action } from './action';
import { PermissionService } from './permission.service';
import { AuthorizationModuleOptions } from './interfaces/authorization-module.interface';
import { PermissionProvider } from './permission.provider';
import { AUTHORIZATION_MODULE_OPTIONS } from './authorization.constants';

@Injectable({ scope: Scope.REQUEST })
export class PermissionInterceptor extends ClassSerializerInterceptor {
  private provider: PermissionProvider;
  constructor(
    @Inject('Reflector') protected readonly reflector: any,
    @Inject(REQUEST) private request: any,
    @Inject(AUTHORIZATION_MODULE_OPTIONS)
    options: AuthorizationModuleOptions,
    private permissionService: PermissionService,
    @Optional() protected readonly defaultOptions: ClassTransformOptions = {}
  ) {
    super(reflector, defaultOptions);
    this.provider = options.permissionProvider;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextOptions = this.getContextOptions(context);
    const options = Object.assign(
      Object.assign({}, this.defaultOptions),
      contextOptions
    );
    return next.handle().pipe(
      mergeMap(data => {
        return from(this.provider.getPermissionSet(this.request)).pipe(
          mergeMap(permissionSet => {
            const fields = Reflect.getMetadata('actions', data);
            return from(
              fields.reduce(
                async (result: any, [field, action]: [string, Action]) => {
                  const res = await result;
                  if (
                    !(await this.permissionService.areAllowed(
                      [action],
                      permissionSet,
                      context
                    ))
                  ) {
                    delete res[field];
                  }
                  return res;
                },
                Promise.resolve(data)
              )
            ).pipe(map((data: any) => this.serialize(data, options)));
          })
        );
      })
    );
  }
}
