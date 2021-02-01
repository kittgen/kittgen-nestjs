import { Column, ColumnOptions } from 'typeorm';
import { TYPEORM_HISTORY_SNAPSHOT_COLUMN } from './typeorm-history.constants';

export function SnapshotColumn(columnOpts: ColumnOptions): Function {
  return (target: any, key: any) => {
    Reflect.defineMetadata(TYPEORM_HISTORY_SNAPSHOT_COLUMN, key, target);
    return Column({
      ...columnOpts,
    })(target, key);
  };
}
