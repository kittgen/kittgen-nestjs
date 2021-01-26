import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';
import { v4 as uuid4 } from 'uuid';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  constructor(props: Partial<User>) {
    Object.assign(this, props);
  }

  @BeforeInsert()
  createId() {
    this.id = `usr-${uuid4()}`;
  }
}
