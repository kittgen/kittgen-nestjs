import { DynamicModule, Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { TYPEORM_HISTORY_OPTIONS } from './typeorm-history.constants';
import { TypeOrmHistoryModuleOptions } from './typeorm-history.interface';

@Module({})
export class TypeOrmHistoryModule {
  static register(options: TypeOrmHistoryModuleOptions): DynamicModule {
    return {
      module: TypeOrmHistoryModule,
      providers: [
        HistoryService,
        {
          provide: TYPEORM_HISTORY_OPTIONS,
          useValue: options,
        },
      ],
      exports: [HistoryService],
    };
  }
}
