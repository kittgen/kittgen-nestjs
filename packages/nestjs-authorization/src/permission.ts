import { Condition } from './condition';

export interface Permission {
  readonly action: string;
  readonly condition?: Condition;
}

export class SimplePermission implements Permission {
  constructor(readonly action: string, readonly condition?: Condition) {}
}
