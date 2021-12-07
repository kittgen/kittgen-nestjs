# Kittgen TypeORM History

TypeORM based module for keeping histories of entities.

[Check the main page for Kittgen](https://github.com/kittgen/kittgen-nestjs) for further information.

## Feature Overview
* Keep a history of your entities
* Customization of history properties
* Lightweight 

## Usage
### Installation

```bash
npm i @kittgen/nestjs-typeorm-history
```

### Declare your history entity

```ts
import {
  HistoryFor,
  HistoryActionType,
  HistoryActionColumn,
  MappedColumn,
  SnapshotColumn,
} from '@kittgen/nestjs-typeorm-history';

@Entity()
@HistoryFor(User) 
export class UserHistory {

  // some ID column
  @PrimaryGeneratedColumn()
  id: string;

  @SnapshotColumn({ type: 'jsonb' })
  payload: User

  @HistoryActionColumn()
  action: HistoryActionType

  // optional, map payload properties as column
  @MappedColumn<User>((user: User) => user.firstName, { name: 'nickname' })
  nickname: string

  // any other properties
  // ...
}
```

Properties decorated with `@SnapshotColumn` and `@HistoryActionColumn` are required. 
`HistoryActionType` supports three possible values: `CREATED`, `UPDATED` and `DELETED`.

The `MappedColumn` decorator can be used to map properties of an entity directly to a column.
You don't need to use `jsonb`, alternatively you can also use embedded entities:

```ts
@Column(() => User, { prefix: 'user' })
payload: User;
```

Dont't forget to make your history entities known to TypeORM by adding them to the `entities`
property.

```ts
// other TypeORM config properties
entities: [User, UserHistory],
// ...
```

### Register the module

In the `imports` array of your module, add the `TypeOrmHistoryModule` and call `registerAsync`.

You have to provide the TypeORM connection.

```ts
import { TypeOrmHistoryModule } from '@kittgen/nestjs-typeorm-history';

TypeOrmHistoryModule.registerAsync({
  inject: [Connection],
  useFactory: (connection: Connection) => ({
    connection,
  })
})
```

## Local Development

### Local Library Development

#### Important Commands

```bash

# start in watcher mode
npm start

# builds to the 'dist' folder
npm run build

# runs the tests
npm test

```

#### Commits

We use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) for nice commit messages and automated versioning/changelog.

This packages uses [TSDX](https://github.com/jaredpalmer/tsdx).

## Credits

This package is based on https://github.com/anchan828/typeorm-helpers

## License

Kittgen is licensed under MIT. See LICENSE.

## Authors

Kittgen is developed by Otto von Wesendonk and Edgar Müller.
