import { Column, ColumnOptions } from 'typeorm';
import { TYPEORM_HISTORY_MAPPED_COLUMNS } from './typeorm-history.constants';

export function MappedColumn<E>(
  mappingFn: (e: E) => any,
  columnOpts: ColumnOptions
): Function {
  return (target: any, key: any) => {
    const fields =
      Reflect.getMetadata(TYPEORM_HISTORY_MAPPED_COLUMNS, target) || [];

    if (!fields.includes(key)) {
      fields.push([key, mappingFn]);
    }
    Reflect.defineMetadata(TYPEORM_HISTORY_MAPPED_COLUMNS, fields, target);
    return Column({
      ...columnOpts,
    })(target, key);
  };
}
