import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  Inject,
  Injectable,
  Optional,
} from '@nestjs/common';
import { ClassTransformOptions } from 'class-transformer';
import { Observable, from } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { Action } from '../actions/action';
import { PermissionService } from './permission.service';
import { AuthorizationModuleOptions } from '../authorization-module.interface';
import { PermissionProvider } from './permission.provider';
import {
  AUTHORIZATION_EXPOSED_WITH_PERMISSION_PROPS,
  AUTHORIZATION_MODULE_OPTIONS,
} from '../authorization.constants';
import { PermissionSet } from './permission-set';

const deepForEach = async (
  obj: Record<string, any>,
  fn: (value: any) => Promise<any>
): Promise<Record<string, any>> => {
  if (typeof obj !== 'object' || obj == null) {
    return obj;
  }
  const updatedObj = await fn(obj);
  return Object.keys(updatedObj).reduce(async (acc, key) => {
    const updated = await acc;
    if (Array.isArray(updated[key])) {
      updated[key] = await Promise.all(
        updated[key].map(async (el: any) => deepForEach(el, fn))
      );
    } else if (typeof updated[key] === 'object') {
      updated[key] = await deepForEach(updated[key], fn);
    }
    return Promise.resolve(updated);
  }, Promise.resolve(updatedObj));
};

const removeProps = (
  permissionSet: PermissionSet,
  permissionService: PermissionService,
  context: ExecutionContext
) => async (data: any): Promise<any> => {
  if (typeof data !== 'object' || data == null) {
    return;
  }
  const props =
    Reflect.getMetadata(AUTHORIZATION_EXPOSED_WITH_PERMISSION_PROPS, data) ||
    [];
  return await props.reduce(
    async (result: any, [prop, action]: [string, Action]) => {
      const res = await result;
      const allowed = await permissionService.areAllowed(
        [action],
        permissionSet,
        context
      );
      if (!allowed) {
        delete res[prop];
      }
      return res;
    },
    Promise.resolve(data)
  );
};

@Injectable()
export class PermissionInterceptor extends ClassSerializerInterceptor {
  private provider: PermissionProvider;
  constructor(
    @Inject('Reflector') protected readonly reflector: any,
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
        return from(
          this.provider.getPermissionSet(context.switchToHttp().getRequest())
        ).pipe(
          mergeMap((permissionSet: PermissionSet) => {
            return from(
              deepForEach(
                data,
                removeProps(permissionSet, this.permissionService, context)
              )
            ).pipe(map((data: any) => this.serialize(data, options)));
          })
        );
      })
    );
  }
}
