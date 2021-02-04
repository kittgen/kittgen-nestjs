import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
  Connection,
  EntitySubscriberInterface,
  getMetadataArgsStorage,
} from 'typeorm';
import { createHistorySubscriber } from './history-subscriber';
import {
  TYPEORM_HISTORY_HISTORY_FOR,
  TYPEORM_HISTORY_OPTIONS,
} from './typeorm-history.constants';
import { TypeOrmHistoryModuleOptions } from './typeorm-history.interface';

const createSubscriber = (
  entity: Function,
  historyEntity: Function
): EntitySubscriberInterface<any> => {
  return createHistorySubscriber(entity, historyEntity);
};

@Injectable()
export class HistoryService {
  constructor(
    @InjectConnection() connection: Connection,
    //@ts-ignore
    @Inject(TYPEORM_HISTORY_OPTIONS) options: TypeOrmHistoryModuleOptions
  ) {
    const entities = getMetadataArgsStorage().tables.reduce((acc, t) => {
      const e = Reflect.getMetadata(TYPEORM_HISTORY_HISTORY_FOR, t.target);
      if (e !== undefined) {
        acc.push({
          entity: e,
          history: t.target,
        });
      }
      return acc;
    }, [] as any[]);
    entities
      .map(({ entity, history }) => {
        return createSubscriber(entity, history);
      })
      .forEach(subscriber => connection.subscribers.push(subscriber));
  }
}
