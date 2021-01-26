import { Column } from 'typeorm';
import { HistoryActionKind } from './typeorm-history.interface';

export function HistoryColumn(): Function {
  return Column({
    default: HistoryActionKind.Created,
    enum: Object.values(HistoryActionKind),
    type: 'enum',
  });
}
