import { Injectable, Type } from '@nestjs/common';
import { Condition } from './condition';

@Injectable()
export class ConditionService {
  private conditionsByIdOrType: Map<string | Type, Condition>;

  constructor() {
    this.conditionsByIdOrType = new Map();
  }

  register(condition: Condition) {
    this.conditionsByIdOrType.set(condition.id, condition);
  }

  findById(conditionId: string): Condition | undefined {
    return this.conditionsByIdOrType.get(conditionId);
  }

  findByType(type: Type): Condition | undefined {
    return this.conditionsByIdOrType.get(type.name);
  }
}
