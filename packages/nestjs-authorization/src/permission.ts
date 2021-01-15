import { Action, ActionBuilder } from './action';
import { Condition } from './condition';

export interface Permission {
  readonly action: string;
  readonly condition?: Condition;
}

export class SimplePermission implements Permission {
  readonly action: string;
  readonly condition?: Condition;

  constructor(action: Action, condition?: Condition) {
    let actionName = null;
    if (action instanceof ActionBuilder) {
      actionName = action.name;
    } else {
      actionName = action;
    }
    this.action = actionName;
    this.condition = condition;
  }
}
