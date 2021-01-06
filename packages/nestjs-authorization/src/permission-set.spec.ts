import { createMock } from '@golevelup/nestjs-testing';
import { ExecutionContext } from '@nestjs/common';
import { Permission } from './permission';
import { PermissionSet } from './permission-set';

describe('PermissionSet', () => {
  it('should check for actions', async () => {
    const permissions = new PermissionSet([
      new Permission('foo'),
      new Permission('bar'),
    ]);
    const context = createMock<ExecutionContext>();

    expect(await permissions.isAllowed(['foo'], context)).toBeTruthy();
    expect(await permissions.isAllowed(['bar'], context)).toBeTruthy();
    expect(await permissions.isAllowed(['baz'], context)).toBeFalsy();
    expect(await permissions.isAllowed(['foo', 'bar'], context)).toBeTruthy();
    expect(
      await permissions.isAllowed(['foo', 'bar', 'baz'], context)
    ).toBeFalsy();
  });

  it('should add a permission', async () => {
    const permissions = new PermissionSet([]);
    const context = createMock<ExecutionContext>();

    permissions.add([new Permission('foo')]);

    expect(await permissions.isAllowed(['foo'], context)).toBeTruthy();
  });
});
