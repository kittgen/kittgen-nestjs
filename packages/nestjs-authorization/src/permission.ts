import { Condition } from './condition';

export interface Permission {
  action: string;
  condition?: Condition;
}

export class DefaultPermission implements Permission {
  constructor(readonly action: string, readonly condition?: Condition) {}
}
