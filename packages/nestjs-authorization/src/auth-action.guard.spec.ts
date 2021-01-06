import { createMock } from '@golevelup/nestjs-testing';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DefaultPermission } from './permission';
import { AuthActionGuard } from './auth-action.guard';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { AbstractCondition } from './condition';
import { ConditionService } from './condition.service';
import { AbstractPermissionProvider } from './permission.provider';
import { DefaultPermissionSet } from './permission-set';

@Injectable()
class AlwaysTrueCondition extends AbstractCondition {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  check(_ctx: ExecutionContext): Promise<boolean> {
    return Promise.resolve(true);
  }
}

@Injectable()
class AlwaysFalseCondition extends AbstractCondition {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  check(_ctx: ExecutionContext): Promise<boolean> {
    return Promise.resolve(false);
  }
}

class TestPermissionProivider extends AbstractPermissionProvider { 
  
  constructor(readonly conditionService: ConditionService) {
    super()
  }
  
  getPermissionSetForUser(
    user: any
  ): Promise<DefaultPermissionSet> {
    switch (user.id) {
      case 'uid-1':
        return Promise.resolve(
          new DefaultPermissionSet([new DefaultPermission('read')])
        );
      case 'uid-2':
        return Promise.resolve(
          new DefaultPermissionSet([new DefaultPermission('write')])
        );
      case 'uid-3':
        return Promise.resolve(
          new DefaultPermissionSet([
            new DefaultPermission(
              'write',
              this.conditionService.find(AlwaysFalseCondition.name)
            ),
          ])
        );
      case 'uid-4':
        return Promise.resolve(
          new DefaultPermissionSet([
            new DefaultPermission(
              'write',
              this.conditionService.find(AlwaysTrueCondition.name)
            ),
          ])
        );
      default:
        return Promise.resolve(new DefaultPermissionSet());
    }
  }
}

describe('AuthActionGuard', () => {

  function createTestModule(actions: string[]) {
    return Test.createTestingModule({
      imports: [],
      providers: [
        ConditionService,
        AlwaysFalseCondition,
        AlwaysTrueCondition,
        {
          provide: TestPermissionProivider,
          inject: [ConditionService],
          useFactory: (conditionsService: ConditionService) => {
            return new TestPermissionProivider(conditionsService)
          }
        },
        {
          provide: 'GUARD',
          useClass: AuthActionGuard(actions),
        },
      ],
    }).compile();
  }

  it('canActivate should return false if user has NOT permission', async () => {
    const app = (await createTestModule(['write'])).createNestApplication();
    await app.init();
    const policyGuard = await app.resolve('GUARD');
    const context = createMock<ExecutionContext>({
      switchToHttp: () =>
        createMock<HttpArgumentsHost>({
          getRequest: () => ({
            user: {
              id: 'uid-1',
            },
          }),
        }),
    });

    expect(await policyGuard.canActivate(context)).toBeFalsy();
  });

  it('canActivate should return true if user has permission', async () => {
    const app = (await createTestModule(['write'])).createNestApplication();
    await app.init();
    const policyGuard = await app.resolve('GUARD');
    const context = createMock<ExecutionContext>({
      switchToHttp: () =>
        createMock<HttpArgumentsHost>({
          getRequest: () => ({
            user: {
              id: 'uid-2',
            },
          }),
        }),
    });

    expect(await policyGuard.canActivate(context)).toBeTruthy();
  });

  it('canActivate should return false if user has permission, but condition fails', async () => {
    const app = (await createTestModule(['read'])).createNestApplication();
    await app.init();
    const policyGuard = await app.resolve('GUARD');
    const context = createMock<ExecutionContext>({
      switchToHttp: () =>
        createMock<HttpArgumentsHost>({
          getRequest: () => ({
            user: {
              id: 'uid-3',
            },
          }),
        }),
    });

    expect(await policyGuard.canActivate(context)).toBeFalsy();
  });

  it('canActivate should return true if user has permission and condition is fulfillled', async () => {
    const app = (await createTestModule(['write'])).createNestApplication();
    await app.init();
    const policyGuard = app.get('GUARD');
    const context = createMock<ExecutionContext>({
      switchToHttp: () =>
        createMock<HttpArgumentsHost>({
          getRequest: () => ({
            user: {
              id: 'uid-4',
            },
          }),
        }),
    });

    expect(await policyGuard.canActivate(context)).toBeTruthy();
  });
});
