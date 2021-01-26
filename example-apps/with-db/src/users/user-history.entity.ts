import {
  History,
  HistoryActionKind,
  HistoryColumn,
  MappedColumn,
} from '@kittgen/nestjs-typeorm-history';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserHistory implements History<User> {
  @PrimaryGeneratedColumn()
  id: number;

  // You can also use embedded entities instead of JSON blobs
  // @Column(() => User, { prefix: 'user' })
  // payload: User;
  @Column({
    type: 'jsonb',
  })
  payload: User;

  @MappedColumn<User>((user: User) => user.firstName, { name: 'nickname' })
  nickname: string;

  @MappedColumn<User>((user: User) => user.lastName, { name: 'surname' })
  surname: string;

  @HistoryColumn()
  action: HistoryActionKind;
}
