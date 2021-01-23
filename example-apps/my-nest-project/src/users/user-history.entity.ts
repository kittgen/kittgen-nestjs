import {
  History,
  HistoryActionKind,
  HistoryColumn,
} from '@kittgen/nestjs-typeorm-history';
import { Column, Entity } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserHistory extends User implements History {
  @Column()
  entityId: string;

  @HistoryColumn()
  action: HistoryActionKind;
}
