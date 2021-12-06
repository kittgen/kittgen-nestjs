import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { HistoryService } from './history.service';
import { TYPEORM_HISTORY_OPTIONS } from './typeorm-history.constants';
import {
  TypeOrmHistoryModuleAsyncOptions,
  TypeOrmHistoryModuleOptions,
  TypeOrmHistoryOptionsFactory,
} from './typeorm-history.interface';

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

  static registerAsync(
    options: TypeOrmHistoryModuleAsyncOptions
  ): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: TypeOrmHistoryModule,
      imports: [...(options.imports || [])],
      providers: [
        HistoryService,
        ...asyncProviders,
        ...(options.extraProviders || []),
      ],
      exports: [...asyncProviders],
    };
  }

  private static createAsyncProviders(
    options: TypeOrmHistoryModuleAsyncOptions
  ): Provider[] {
    if (options.useFactory || options.useExisting) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<TypeOrmHistoryOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
        inject: [...(options.inject || [])],
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: TypeOrmHistoryModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: TYPEORM_HISTORY_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: TYPEORM_HISTORY_OPTIONS,
      useFactory: async (optionsFactory: TypeOrmHistoryOptionsFactory) =>
        optionsFactory.createOptions(),
      inject: [(options.useExisting || options.useClass)!],
    };
  }
}
