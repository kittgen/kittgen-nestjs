import { Type } from '@nestjs/common';
import { TYPEORM_HISTORY_HISTORY_FOR } from './typeorm-history.constants';

export function HistoryFor<E>(e: Type<E>): Function {
  return (target: any) => {
    Reflect.defineMetadata(TYPEORM_HISTORY_HISTORY_FOR, e, target);
  };
}
