# Kittgen Nestjs Authorization

Permission based authorization for Nestjs.

[Check the main page for Kittgen](https://github.com/kittgen/kittgen-nestjs) for further information.

## Feature Overview
- Define `Actions` and respective `Permissions` permitting them.
- Enables to implement RBAC (Role Based Access Control) easyly.
- Annotate Controller with Permission checks.
- Use Conditional Permissions Checks. e.g. `@CheckPermission(UpdateBlogPost.if(IsAuthor))`.
- Designed for use database managed permissions and conditions.
- Permission based Dto filtering. Only expose fields you have the permission for.

## Usage

### Installation

```bash
npm i @kittgen/nestjs-authorization
```

### Define your Actions

In classic RBAC literature `Actions` are called `Operations`. They are the same thing, we chose a different name.

```ts
import { createAction } from '@kittgen/nestjs-authorization';

export const ReadArticles = createAction('read-articles');
```

### Annotate your controllers

#### Using Guards

```ts
import { PermissionGuard } from '@kittgen/nestjs-authorization'
import { ReadArticles } from './articles.auth-actions'

@Get(':id')
@UseGuards(
  PermissionGuard(ReadArticles)
)
findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
}
```

**Conditional actions**

Actions can also be conditional, i.e. the permission for a given 
action is only granted if the attached condition evaluates to true. For instance in 
`@CheckPermission(UpdateBlogPost.if(IsAuthor))` the check for the `UpdateBlogPost` action
only succeeds if the `IsAuthor` condition also evaluates to true. Check the dummy implementation of the
[IsAuthor](https://github.com/kittgen/kittgen-nestjs/blob/main/example-apps/with-db/src/is-author.condition.ts) condition for an example.

```ts
import { PermissionGuard } from '@kittgen/nestjs-authorization'
import { ReadAllArticles, ReadArticle, IsAuthor } from './articles.auth-actions'

@Get(':id')
@UseGuards(
  PermissionGuard(
    ReadAllArticles
    ReadArticle.if(IsAuthor)
  )
)
findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
}
```

#### Using Decorator

```ts
import { CheckPermission } from '@kittgen/nestjs-authorization'
import { ReadArticles } from './articles.auth-actions'

@Get(':id')
@CheckPermission(ReadArticles)

findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
}
```

### Implement PermissionProvider

#### Define a PermissionProvider

```ts
import {
  AbstractPermissionProvider,
  PermissionSet,
  SimplePermissionSet,
  SimplePermission,
} from '@kittgen/nestjs-authorization';

export class MyPermissionProvider extends AbstractPermissionProvider {
  getPermissionSet(req: any): Promise<PermissionSet> {
    // implement your custom resolving logic here
    // example:
    return Promise.resolve(
      new SimplePermissionSet(new SimplePermission('read-article'))
    );
  }
}
```

**Conditional permissions**

Like with actions, permissions can also be conditional, i.e. they are only granted
if the attached condition evaluates to true. An example can be found in our [test suite](https://github.com/kittgen/kittgen-nestjs/blob/main/packages/nestjs-authorization/src/permissions/permission.guard.spec.ts).

#### Register your PermissionProvider

Call `registeryAsync` on the `AuthorizationModule` and provide your 
`permissionProvider`. The registered module will be global, hence you only
need to do this step once.
In the example below we assume that the permission provider has a dependency
on the `UsersService` which is why we inject the `UsersModule` as well.

```ts
import { AuthorizationModule } from '@kittgen/nestjs-authorization';
import { MyPermissionProvider } from './my-permission-provider';

@Module({
  imports: [
    AuthorizationModule.registerAsync({
      imports: [UsersModule],
      inject: [UsersService],
      useFactory: (userService: UsersService) => ({
        permissionProvider: new MyPermissionProvider(userService)
      })
    }),
    UsersModule,
  ],
  // ...
})
export class MyModule {}
```

### Expose fields conditionally

You can decorate your class-validator based DTO classes with the
`@ExposeWithPermission` decorator in order to remove fields from the response payload
in case the requesting entity is missing the required permission, e.g. in this example
the `published` property is only exposed in case the `write-article` is sufficed.

```ts
class MyArticelDto { 
  @ExposeWithPermission('write-article')
  @IsBoolean()
  published: boolean;

  // ...
}
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
