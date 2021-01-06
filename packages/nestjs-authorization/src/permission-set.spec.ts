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

    expect(await permissions.areAllowed(['foo'], context)).toBeTruthy();
    expect(await permissions.areAllowed(['bar'], context)).toBeTruthy();
    expect(await permissions.areAllowed(['baz'], context)).toBeFalsy();
    expect(await permissions.areAllowed(['foo', 'bar'], context)).toBeTruthy();
    expect(
      await permissions.areAllowed(['foo', 'bar', 'baz'], context)
    ).toBeFalsy();
  });

  it('should add a permission', async () => {
    const permissions = new DefaultPermissionSet([]);
    const context = createMock<ExecutionContext>();

    permissions.add([new DefaultPermission('foo')]);

    expect(await permissions.areAllowed(['foo'], context)).toBeTruthy();
  });
});
