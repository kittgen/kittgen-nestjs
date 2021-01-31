# Kittgen TypeORM History

TypeORM based module for keeping a history of an entity.

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
  History,
  HistoryActionKind,
  HistoryColumn,
  MappedColumn,
} from '@kittgen/nestjs-typeorm-history';

@Entity()
export class UserHistory implements History<User> {

  @Column({ type: 'jsonb' })
  payload: User

  @HistoryColumn()
  action: HistoryActionKind

  // optional, map payload properties as column
  @MappedColumn<User>((user: User) => user.firstName, { name: 'nickname' })
  nickname: string

  // any other properties
}
```

The `action` and `payload` properties are required. 
`HistoryActionKind` supports three values: `CREATED`, `UPDATED` and `DELETED`.

The `MappedColumn` decorator can be used to map properties of an entity directly to a column.
You don't need to use `jsonb`, alternativelly you can also use embedded entities:

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

In the `imports` array of your module, add the `TypeOrmHistoryModule` and declare the mapping 
of the entity and its history:

```ts
 TypeOrmHistoryModule.register({
    entities: [
      {
        entity: User,
        history: UserHistory,
      },
    ],
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

## License

Kittgen is licensed under MIT. See LICENSE.

## Authors

Kittgen is developed by Otto von Wesendonk and Edgar Müller.
