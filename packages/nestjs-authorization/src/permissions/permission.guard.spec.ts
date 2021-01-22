import { createMock } from '@golevelup/nestjs-testing';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SimplePermission } from './permission';
import { PermissionGuard } from './permission.guard';
import { HttpArgumentsHost, INestApplication } from '@nestjs/common/interfaces';
import { AbstractCondition } from '../conditions/condition';
import { ConditionService } from '../conditions/condition.service';
import { AbstractPermissionProvider } from './permission.provider';
import { SimplePermissionSet } from './permission-set';
import { Action, createAction } from '../actions/action';
import { PermissionService } from './permission.service';
import { AUTHORIZATION_MODULE_OPTIONS } from '../authorization.constants';

@Injectable()
class AlwaysTrueCondition extends AbstractCondition {
  constructor(conditionService: ConditionService) {
    super(conditionService);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  check(_ctx: ExecutionContext): Promise<boolean> {
    return Promise.resolve(true);
  }
}

@Injectable()
class AlwaysFalseCondition extends AbstractCondition {
  constructor(conditionService: ConditionService) {
    super(conditionService);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  check(_ctx: ExecutionContext): Promise<boolean> {
    return Promise.resolve(false);
  }
}

class TestActions {
  static Read = createAction('read');
  static Write = createAction('write');
  static Admin = createAction('all');
}

class TestPermissionProivider extends AbstractPermissionProvider {
  constructor(readonly conditionService: ConditionService) {
    super();
  }

  getPermissionSet(req: any): Promise<SimplePermissionSet> {
    switch (req.user.id) {
      case 'uid-1':
        return Promise.resolve(
          new SimplePermissionSet(new SimplePermission('read'))
        );
      case 'uid-2':
        return Promise.resolve(
          new SimplePermissionSet(new SimplePermission('write'))
        );
      case 'uid-3':
        return Promise.resolve(
          new SimplePermissionSet(
            new SimplePermission(
              'write',
              this.conditionService.findById(AlwaysFalseCondition.name)
            )
          )
        );
      case 'uid-4':
        return Promise.resolve(
          new SimplePermissionSet(
            new SimplePermission(
              'write',
              this.conditionService.findById(AlwaysTrueCondition.name)
            )
          )
        );
      default:
        return Promise.resolve(new SimplePermissionSet());
    }
  }
}

const initApp = async (...actions: Action[]): Promise<INestApplication> => {
  const app = (await createTestModule(actions)).createNestApplication();
  await app.init();
  return app;
};

const createMockContext = (req: any) =>
  createMock<ExecutionContext>({
    switchToHttp: () =>
      createMock<HttpArgumentsHost>({
        getRequest: () => req,
      }),
  });

function createTestModule(actions: Action[]) {
  return Test.createTestingModule({
    imports: [],
    providers: [
      ConditionService,
      PermissionService,
      AlwaysFalseCondition,
      AlwaysTrueCondition,
      {
        provide: AUTHORIZATION_MODULE_OPTIONS,
        inject: [ConditionService],
        useFactory: (conditionsService: ConditionService) => ({
          permissionProvider: new TestPermissionProivider(conditionsService),
        }),
      },
      {
        provide: 'GUARD',
        useClass: PermissionGuard(...actions),
      },
    ],
  }).compile();
}

describe('PermissionGuard', () => {
  it('canActivate should return false if user has NOT permission', async () => {
    const app = await initApp('write');
    const guard = await app.get('GUARD');
    const context = createMockContext({ user: { id: 'uid-1' } });

    expect(await guard.canActivate(context)).toBeFalsy();
  });

  it('canActivate should return true if user has permission', async () => {
    const app = await initApp('write');
    const guard = await app.get('GUARD');
    const context = createMockContext({ user: { id: 'uid-2' } });

    expect(await guard.canActivate(context)).toBeTruthy();
  });

  it('canActivate should return false if user has permission, but condition fails', async () => {
    const app = await initApp('read');
    const guard = await app.get('GUARD');
    const context = createMockContext({ user: { id: 'uid-3' } });

    expect(await guard.canActivate(context)).toBeFalsy();
  });

  it('canActivate should return true if user has permission and condition is fulfillled', async () => {
    const app = await initApp('write');
    const guard = app.get('GUARD');
    const context = createMockContext({ user: { id: 'uid-4' } });

    expect(await guard.canActivate(context)).toBeTruthy();
  });

  it('should support multiple actions', async () => {
    const app = await initApp(TestActions.Read, TestActions.Write);
    const guard = app.get('GUARD');
    const context = createMockContext({ user: { id: 'uid-2' } });

    expect(await guard.canActivate(context)).toBeTruthy();
  });

  it('should support conditional action', async () => {
    const app = await initApp(
      TestActions.Write.if(
        ctx => ctx.switchToHttp().getRequest().body.condition
      )
    );
    const guard = app.get('GUARD');

    // user 1 has only read permission
    expect(
      await guard.canActivate(
        createMockContext({ user: { id: 'uid-1' }, body: { condition: true } })
      )
    ).toBeFalsy();

    // user 2 has only write permission
    expect(
      await guard.canActivate(
        createMockContext({ user: { id: 'uid-2' }, body: { condition: true } })
      )
    ).toBeTruthy();
    expect(
      await guard.canActivate(
        createMockContext({ user: { id: 'uid-2' }, body: { condition: false } })
      )
    ).toBeFalsy();
  });

  it('should support conditional action via type', async () => {
    const app = await initApp(TestActions.Write.if(AlwaysTrueCondition));
    const guard = app.get('GUARD');

    // user 1 has only read permission
    expect(
      await guard.canActivate(createMockContext({ user: { id: 'uid-1' } }))
    ).toBeFalsy();

    // user 2 has only write permission
    expect(
      await guard.canActivate(createMockContext({ user: { id: 'uid-2' } }))
    ).toBeTruthy();
  });
});
