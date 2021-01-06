import { createMock } from '@golevelup/nestjs-testing';
import { ExecutionContext } from '@nestjs/common';
import { DefaultPermission } from './permission';
import { DefaultPermissionSet } from './permission-set';

describe('PermissionSet', () => {
  it('should check for actions', async () => {
    const permissions = new DefaultPermissionSet([
      new DefaultPermission('foo'),
      new DefaultPermission('bar'),
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
    const permissions = new DefaultPermissionSet([]);
    const context = createMock<ExecutionContext>();

    permissions.add([new DefaultPermission('foo')]);

    expect(await permissions.isAllowed(['foo'], context)).toBeTruthy();
  });
});
