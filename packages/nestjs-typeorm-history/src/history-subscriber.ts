import {
  EntityManager,
  EntityMetadata,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import {
  History,
  HistoryActionKind,
  HistoryEntitySubscriberInterface,
} from './common';

export const createHistorySubscriber = <E, H extends History & E>(
  entity: Function,
  historyEntity: Function
) => {
  return new HistoryEntitySubscriber<E, H>(entity, historyEntity);
};

@EventSubscriber()
export class HistoryEntitySubscriber<E, H extends History & E>
  implements HistoryEntitySubscriberInterface<E, H> {
  constructor(readonly entity: Function, readonly historyEntity: Function) {}

  public beforeInsertHistory(history: H): H | Promise<H> {
    return history;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public afterInsertHistory(_history: H): void | Promise<void> {}
  public beforeUpdateHistory(history: H): H | Promise<H> {
    return history;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public afterUpdateHistory(_history: H): void | Promise<void> {}
  public beforeRemoveHistory(history: H): H | Promise<H> {
    return history;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public afterRemoveHistory(_history: H): void | Promise<void> {}

  public listenTo(): Function {
    return this.entity;
  }

  public createHistoryEntity(
    manager: Readonly<EntityManager>,
    entity: E
  ): H | Promise<H> {
    return manager.create(this.historyEntity, entity);
  }

  public async afterInsert(event: InsertEvent<E>): Promise<void> {
    console.log('AAA');
    await this.createHistory(
      event.manager,
      event.metadata,
      this.beforeInsertHistory,
      this.afterInsertHistory,
      HistoryActionKind.Created,
      event.entity
    );
  }

  public async afterUpdate(event: UpdateEvent<E>): Promise<void> {
    await this.createHistory(
      event.manager,
      event.metadata,
      this.beforeUpdateHistory,
      this.afterUpdateHistory,
      HistoryActionKind.Updated,
      event.entity
    );
  }

  public async beforeRemove(event: RemoveEvent<E>): Promise<void> {
    await this.createHistory(
      event.manager,
      event.metadata,
      this.beforeRemoveHistory,
      this.afterRemoveHistory,
      HistoryActionKind.Deleted,
      event.entity
    );
  }

  private async createHistory(
    manager: Readonly<EntityManager>,
    metadata: Readonly<EntityMetadata>,
    beforeHistoryFunction: (history: H) => H | Promise<H>,
    afterHistoryFunction: (history: H) => void | Promise<void>,
    action: Readonly<HistoryActionKind>,
    entity?: E
  ): Promise<void> {
    if (!entity || Object.keys(metadata.propertiesMap).includes('action')) {
      return;
    }

    const history = await this.createHistoryEntity(manager, entity);
    history.action = action;

    for (const primaryColumn of metadata.primaryColumns) {
      history.entityId = Reflect.get(history, primaryColumn.propertyName);
      Reflect.deleteProperty(history, primaryColumn.propertyName);
    }

    await beforeHistoryFunction(history);
    await manager.save(history);
    await afterHistoryFunction(history);
  }
}
