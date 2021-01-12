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
import { PermissionProvider } from './permission.provider';
import { Action } from './action';
import { PermissionService } from './permission.service';

@Injectable({ scope: Scope.REQUEST })
export class PermissionInterceptor extends ClassSerializerInterceptor {
  constructor(
    @Inject('Reflector') protected readonly reflector: any,
    @Inject(REQUEST) private request: any,
    @Inject('PERMISSION_PROVIDER')
    private permissionProvider: PermissionProvider,
    private permissionService: PermissionService,
    @Optional() protected readonly defaultOptions: ClassTransformOptions = {}
  ) {
    super(reflector, defaultOptions);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextOptions = this.getContextOptions(context);
    const options = Object.assign(
      Object.assign({}, this.defaultOptions),
      contextOptions
    );
    return next.handle().pipe(
      mergeMap(data => {
        return from(
          this.permissionProvider.getPermissionSet(this.request)
        ).pipe(
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
