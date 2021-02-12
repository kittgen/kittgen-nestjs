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
import { ConditionService } from '../conditions/condition.service';

const createMockContext = (req: any = {}) =>
  createMock<ExecutionContext>({
    switchToHttp: () =>
      createMock<HttpArgumentsHost>({
        getRequest: () => req,
      }),
  });

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

const createPermissionInterceptor = (
  ...permissions: string[]
): PermissionInterceptor => {
  const interceptor = new PermissionInterceptor(
    new Reflector(),
    {
      permissionProvider: createPermissionProvider(permissions),
    },
    new PermissionService({} as ConditionService)
  );
  return interceptor;
};

const mockCallHandler = (dto: any) => {
  const callHandler = {
    handle: jest.fn(),
  };
  callHandler.handle.mockReturnValue(from(Promise.resolve(dto)));
  return callHandler;
};

class TestDto {
  @ExposeWithPermission('can-read-foo')
  foo: string;
  bar: string;

  constructor(_foo: string, _bar: string) {
    this.foo = _foo;
    this.bar = _bar;
  }
}

class UndecoratedTestDto {
  baz: string;

  constructor(_baz: string) {
    this.baz = _baz;
  }
}

class NestedTestDto {
  quux: string;

  dto: TestDto;

  constructor(_quux: string, dto: TestDto) {
    this.quux = _quux;
    this.dto = dto;
  }
}
class NestedTestWithConditionalArrayDto {
  quux: string;

  @ExposeWithPermission('can-read-dto')
  dtos: TestDto[];

  constructor(_quux: string, dtos: TestDto[]) {
    this.quux = _quux;
    this.dtos = dtos;
  }
}
class NestedArrayTestDto {
  quux: string;

  dtos: TestDto[];

  constructor(_quux: string, dtos: TestDto[]) {
    this.quux = _quux;
    this.dtos = dtos;
  }
}

describe('PermissionInterceptor', () => {
  describe('intercept', () => {
    it('should exclude properties if permissions are lacking', async () => {
      const callHandler = mockCallHandler(new TestDto('hello', 'world'));
      const interceptor = createPermissionInterceptor();

      const dto = await interceptor
        .intercept(createMockContext(), callHandler)
        .toPromise();

      expect(dto).toHaveProperty('bar');
      expect(dto).not.toHaveProperty('foo');
    });

    it('should include properties if permitted', async () => {
      const callHandler = mockCallHandler(new TestDto('hello', 'world'));
      const interceptor = createPermissionInterceptor('can-read-foo');

      const dto = await interceptor
        .intercept(createMockContext(), callHandler)
        .toPromise();

      expect(dto).toHaveProperty('bar');
      expect(dto).toHaveProperty('foo');
    });

    it('should handle DTOs without decorator', async () => {
      const callHandler = mockCallHandler(new UndecoratedTestDto('hello'));
      const interceptor = createPermissionInterceptor('can-read-foo');

      const dto = await interceptor
        .intercept(createMockContext(), callHandler)
        .toPromise();

      expect(dto).toHaveProperty('baz');
    });

    it('should handle nested DTOs', async () => {
      const callHandler = mockCallHandler(
        new NestedTestDto('quuz', new TestDto('foo', 'bar'))
      );
      const interceptor = createPermissionInterceptor('can-read-foo');

      const dto = await interceptor
        .intercept(createMockContext(), callHandler)
        .toPromise();

      expect(dto).toHaveProperty('quux');
      expect(dto.dto).toEqual({
        foo: 'foo',
        bar: 'bar',
      });
    });

    it('should handle nested array of DTOs', async () => {
      const callHandler = mockCallHandler(
        new NestedArrayTestDto('quuz', [new TestDto('foo', 'bar')])
      );
      const interceptor = createPermissionInterceptor('can-read-foo');

      const dto = await interceptor
        .intercept(createMockContext(), callHandler)
        .toPromise();

      expect(dto).toHaveProperty('quux');
      expect(dto.dtos[0]).toEqual({
        foo: 'foo',
        bar: 'bar',
      });
    });

    it('should handle nested array of DTOs without permission', async () => {
      const executionContext = createMockContext({});
      const callHandler = mockCallHandler(
        new NestedArrayTestDto('quuz', [new TestDto('foo', 'bar')])
      );
      const interceptor = createPermissionInterceptor();

      const dto = await interceptor
        .intercept(executionContext, callHandler)
        .toPromise();

      expect(dto).toHaveProperty('quux');
      expect(dto.dtos[0]).toEqual({
        bar: 'bar',
      });
    });

    it('should exclude nested array if no permission', async () => {
      const callHandler = mockCallHandler(
        new NestedTestWithConditionalArrayDto('quuz', [
          new TestDto('foo', 'bar'),
        ])
      );
      const interceptor = createPermissionInterceptor();

      const dto = await interceptor
        .intercept(createMockContext(), callHandler)
        .toPromise();

      expect(dto).toHaveProperty('quux');
      expect(dto).not.toHaveProperty('dtos');
    });

    it('should not fail on null without permission', async () => {
      const callHandler = mockCallHandler(
        new TestDto(null as any, null as any)
      );
      const interceptor = createPermissionInterceptor();

      const dto = await interceptor
        .intercept(createMockContext(), callHandler)
        .toPromise();

      expect(dto).not.toHaveProperty('foo');
      expect(dto).toHaveProperty('bar');
    });

    it('should not fail on null with permission', async () => {
      const callHandler = mockCallHandler(
        new TestDto(null as any, null as any)
      );
      const interceptor = createPermissionInterceptor('can-read-foo');

      const dto = await interceptor
        .intercept(createMockContext(), callHandler)
        .toPromise();

      expect(dto).toHaveProperty('foo');
      expect(dto).toHaveProperty('bar');
    });

    it('should not fail on undefined without permission', async () => {
      const callHandler = mockCallHandler(
        new TestDto(undefined as any, undefined as any)
      );
      const interceptor = createPermissionInterceptor();

      const dto = await interceptor
        .intercept(createMockContext(), callHandler)
        .toPromise();

      expect(dto).not.toHaveProperty('foo');
      expect(dto).toHaveProperty('bar');
    });

    it('should not fail on undefined with permission', async () => {
      const callHandler = mockCallHandler(
        new TestDto(undefined as any, undefined as any)
      );
      const interceptor = createPermissionInterceptor('can-read-foo');

      const dto = await interceptor
        .intercept(createMockContext(), callHandler)
        .toPromise();

      expect(dto).toHaveProperty('foo');
      expect(dto).toHaveProperty('bar');
    });

    it('should not fail on non-object values', async () => {
      const callHandler = mockCallHandler(false as any);
      const interceptor = createPermissionInterceptor('can-read-foo');

      const dto = await interceptor
        .intercept(createMockContext(), callHandler)
        .toPromise();

      expect(dto).toBeFalsy();
    });
  });
});
