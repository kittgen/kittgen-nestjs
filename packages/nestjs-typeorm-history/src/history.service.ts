import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntitySubscriberInterface } from 'typeorm';
import { createHistorySubscriber } from './history-subscriber';
import { TYPEORM_HISTORY_OPTIONS } from './typeorm-history.constants';
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
    @Inject(TYPEORM_HISTORY_OPTIONS) options: TypeOrmHistoryModuleOptions
  ) {
    (options.entities || [])
      .map(({ entity, history }) => createSubscriber(entity, history))
      .forEach(subscriber => connection.subscribers.push(subscriber));
  }
}
