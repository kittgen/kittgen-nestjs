import {
  SnapshotColumn,
  HistoryFor,
  HistoryActionType,
  HistoryActionColumn,
  MappedColumn,
} from '@kittgen/nestjs-typeorm-history';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
@HistoryFor(User)
export class UserHistory {
  @PrimaryGeneratedColumn()
  id: number;

  // You can also use embedded entities instead of JSON blobs
  // @SnapshotColumn(() => User, { prefix: 'user' })
  // payload: User;
  @SnapshotColumn({
    type: 'jsonb',
  })
  payload1: User;

  @MappedColumn<User>((user: User) => user.firstName, { name: 'nickname' })
  nickname: string;

  @MappedColumn<User>((user: User) => user.lastName, { name: 'surname' })
  surname: string;

  @HistoryActionColumn()
  action: HistoryActionType;
}
