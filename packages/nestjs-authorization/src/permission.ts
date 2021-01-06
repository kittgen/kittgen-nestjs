import { Condition } from './condition';

export class Permission {
  constructor(readonly action: string, readonly condition?: Condition) {}
}
