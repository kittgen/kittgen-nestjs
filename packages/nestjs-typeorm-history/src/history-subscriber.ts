import {
  EntityManager,
  EntityMetadata,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import {
  HistoryActionType,
  HistoryEntitySubscriberInterface,
} from './typeorm-history.interface';
import {
  TYPEORM_HISTORY_SNAPSHOT_COLUMN,
  TYPEORM_HISTORY_MAPPED_COLUMNS,
  TYPEORM_HISTORY_ACTION_COLUMN,
} from './typeorm-history.constants';

export const createHistorySubscriber = <E, H extends Record<string, any>>(
  entity: Function,
  historyEntity: Function
) => {
  return new HistoryEntitySubscriber<E, H>(entity, historyEntity);
};

@EventSubscriber()
export class HistoryEntitySubscriber<E, H extends Record<string, any>>
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
    const e: E = manager.create(this.entity, entity);
    const hist: H = manager.create(this.historyEntity);
    const props = Reflect.getMetadata(TYPEORM_HISTORY_MAPPED_COLUMNS, hist);
    const snapshotProp = Reflect.getMetadata(
      TYPEORM_HISTORY_SNAPSHOT_COLUMN,
      hist
    );
    if (!snapshotProp) {
      throw new Error(
        'No @SnapshotColumn found. Please make sure that your history entity has one.'
      );
    }
    props.forEach(
      ([prop, mappingFn]: [string, (e: E) => any]) =>
        ((hist as any)[prop] = mappingFn(e))
    );
    (hist as any)[snapshotProp] = e;
    return hist;
  }

  public async afterInsert(event: InsertEvent<E>): Promise<void> {
    await this.createHistory(
      event.manager,
      event.metadata,
      this.beforeInsertHistory,
      this.afterInsertHistory,
      HistoryActionType.Created,
      event.entity
    );
  }

  public async afterUpdate(event: UpdateEvent<E>): Promise<void> {
    await this.createHistory(
      event.manager,
      event.metadata,
      this.beforeUpdateHistory,
      this.afterUpdateHistory,
      HistoryActionType.Updated,
      event.entity
    );
  }

  public async beforeRemove(event: RemoveEvent<E>): Promise<void> {
    await this.createHistory(
      event.manager,
      event.metadata,
      this.beforeRemoveHistory,
      this.afterRemoveHistory,
      HistoryActionType.Deleted,
      event.entity
    );
  }

  private async createHistory(
    manager: Readonly<EntityManager>,
    metadata: Readonly<EntityMetadata>,
    beforeHistoryFunction: (history: H) => H | Promise<H>,
    afterHistoryFunction: (history: H) => void | Promise<void>,
    action: Readonly<HistoryActionType>,
    entity?: E
  ): Promise<void> {
    if (!entity || Object.keys(metadata.propertiesMap).includes('action')) {
      return;
    }

    const history = await this.createHistoryEntity(manager, entity);
    const actionProp = Reflect.getMetadata(
      TYPEORM_HISTORY_ACTION_COLUMN,
      history
    );
    if (!actionProp) {
      throw new Error(
        'No @HistoryActionColumn found. Please make sure that your history entity has one.'
      );
    }
    (history as any)[actionProp] = action;

    for (const primaryColumn of metadata.primaryColumns) {
      Reflect.deleteProperty(history, primaryColumn.propertyName);
    }

    await beforeHistoryFunction(history);
    await manager.save(history);
    await afterHistoryFunction(history);
  }
}
