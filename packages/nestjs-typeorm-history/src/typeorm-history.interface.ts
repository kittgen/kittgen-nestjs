import { EntityManager, EntitySubscriberInterface } from 'typeorm';

export interface HistoryEntityMapping {
  entity: Function;
  history: Function;
}

export interface TypeOrmHistoryModuleOptions {}

export interface HistoryEntitySubscriberInterface<E, H>
  extends EntitySubscriberInterface<E> {
  entity: Function;
  historyEntity: Function;

  createHistoryEntity(manager: EntityManager, entity: E): H | Promise<H>;

  beforeInsertHistory(history: H): H | Promise<H>;

  afterInsertHistory(history: H): void | Promise<void>;

  beforeUpdateHistory(history: H): H | Promise<H>;

  afterUpdateHistory(history: H): void | Promise<void>;

  beforeRemoveHistory(history: H): H | Promise<H>;

  afterRemoveHistory(history: H): void | Promise<void>;
}

export enum HistoryActionType {
  Created = 'CREATED',
  Updated = 'UPDATED',
  Deleted = 'DELETED',
}
