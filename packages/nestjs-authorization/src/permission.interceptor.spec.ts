import { createMock } from '@golevelup/nestjs-testing';
import { ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { from } from 'rxjs';
import { SimplePermission } from './permission';
import { ExposeWithPermission } from './expose-with-permission.decorator';
import { PermissionSet, SimplePermissionSet } from './permission-set';
import { PermissionInterceptor } from './permission.interceptor';
import { PermissionProvider } from './permission.provider';
import { PermissionService } from './permission.service';
import { ConditionService } from './condition.service';

const createMockContext = (req: any) =>
  createMock<ExecutionContext>({
    switchToHttp: () =>
      createMock<HttpArgumentsHost>({
        getRequest: () => req,
      }),
  });

const createCallHandler = () => ({
  handle: jest.fn(),
});

const createPermissionInterceptor = (
  permissionProvider: PermissionProvider
): PermissionInterceptor => {
  const interceptor = new PermissionInterceptor(
    new Reflector(),
    undefined,
    {
      permissionProvider,
    },
    new PermissionService({} as ConditionService)
  );
  return interceptor;
};

const createPermissionProvider = (
  permissions: string[] = []
): PermissionProvider => ({
  getPermissionSet: async (_ctx: any): Promise<PermissionSet> => {
    return Promise.resolve(
      new SimplePermissionSet(
        ...permissions.map(perm => new SimplePermission(perm))
      )
    );
  },
});

class TestDto {
  @ExposeWithPermission('can-read-foo')
  foo: string;
  bar: string;

  constructor(_foo: string, _bar: string) {
    this.foo = _foo;
    this.bar = _bar;
  }
}

describe('PermissionInterceptor', () => {
  describe('#intercept', () => {
    it('should exclude properties is permissions are lacking', async () => {
      const executionContext = createMockContext({});
      const callHandler = createCallHandler();
      const interceptor = createPermissionInterceptor(
        createPermissionProvider()
      );
      callHandler.handle.mockReturnValue(
        from(Promise.resolve(new TestDto('hello', 'world')))
      );
      const observable = await interceptor.intercept(
        executionContext,
        callHandler
      );
      const serializedDto = await observable.toPromise();
      expect(serializedDto).toHaveProperty('bar');
      expect(serializedDto).not.toHaveProperty('foo');
    });

    it('should include properties if permitted', async () => {
      const executionContext = createMockContext({});
      const callHandler = createCallHandler();
      const interceptor = createPermissionInterceptor(
        createPermissionProvider(['can-read-foo'])
      );

      callHandler.handle.mockReturnValue(
        from(Promise.resolve(new TestDto('hello', 'world')))
      );
      const observable = await interceptor.intercept(
        executionContext,
        callHandler
      );
      const serializedDto = await observable.toPromise();
      expect(serializedDto).toHaveProperty('bar');
      expect(serializedDto).toHaveProperty('foo');
    });
  });
});
