export interface HistoryEntityMapping {
  entity: Function;
  history: Function;
}

export interface TypeOrmHistoryModuleOptions {
  entities: HistoryEntityMapping[];
}
