import { Condition } from './condition';

export interface Permission {
  action: string
  condition?: Condition
}

export class SimplePermission implements Permission {
  constructor(readonly action: string, readonly condition?: Condition) {}
}
