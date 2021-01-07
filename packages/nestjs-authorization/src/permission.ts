import { Condition } from './condition';

export interface Permission {
  readonly action: string;
  readonly condition?: Condition;
}

export class DefaultPermission implements Permission {
  constructor(readonly action: string, readonly condition?: Condition) {}
}
