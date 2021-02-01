import { Column } from 'typeorm';
import { TYPEORM_HISTORY_ACTION_COLUMN } from './typeorm-history.constants';
import { HistoryActionType } from './typeorm-history.interface';

export function HistoryActionColumn(): Function {
  return (target: any, key: any) => {
    Reflect.defineMetadata(TYPEORM_HISTORY_ACTION_COLUMN, key, target);
    return Column({
      default: HistoryActionType.Created,
      enum: Object.values(HistoryActionType),
      type: 'enum',
    })(target, key);
  };
}
