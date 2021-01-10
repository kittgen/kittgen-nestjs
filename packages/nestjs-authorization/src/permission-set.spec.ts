import { createMock } from '@golevelup/nestjs-testing';
import { ExecutionContext } from '@nestjs/common';
import { SimplePermission } from './permission';
import { SimplePermissionSet } from './permission-set';

describe('PermissionSet', () => {
  it('should check for actions', async () => {
    const permissions = new SimplePermissionSet([
      new SimplePermission('foo'),
      new SimplePermission('bar'),
    ]);
    const context = createMock<ExecutionContext>();

    expect(await permissions.isAllowed('foo', context)).toBeTruthy();
    expect(await permissions.isAllowed('bar', context)).toBeTruthy();
    expect(await permissions.isAllowed('baz', context)).toBeFalsy();
    expect(await permissions.areAllowed(['foo', 'bar'], context)).toBeTruthy();
    expect(
      await permissions.areAllowed(['foo', 'bar', 'baz'], context)
    ).toBeFalsy();
  });

  it('should add a permission', async () => {
    const permissions = new SimplePermissionSet([]);
    const context = createMock<ExecutionContext>();

    permissions.add([new SimplePermission('foo')]);

    expect(await permissions.areAllowed(['foo'], context)).toBeTruthy();
  });
});
