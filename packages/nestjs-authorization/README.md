# Kittgen Nestjs Authorization

Permission based authorization for Nestjs.

[Check the main page for Kittgen](https://github.com/kittgen/kittgen-nestjs) for further information.

## Feature Overview
- Define `Actions` and respective `Permissions` permitting them.
- Enables to implement RBAC (Role Based Access Control) easyly.
- Annotate Controller with Permission checks.
- Use Conditional Permissions Checks. e.g. `@CheckPermission(UpdateBlogPost.if(IsAuthor))'.
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

export const ReadArticles = createAction('read-articles')
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
import { AbstractPermissionProvider, PermissionSet, SimplePermissionSet, SimplePermission } from '@kittgen/nestjs-authorization'

export class MyPermissionProvider extends AbstractPermissionProvider {
    getPermissionSet(req: any): Promise<PermissionSet> {  
       // implement your custom resolving logic here
       // example:
       return Promise.resolve(
         new SimplePermissionSet(new SimplePermission('read-article')),
       );
    }
}
```
#### Register your PermissionProvider
```ts
import { AuthorizationModule, PERMISSION_PROVIDER } from '@kittgen/nestjs-authorization';
import { MyPermissionProvider } from './my-permission-provider';

@Module({
  imports: [
    //...
    AuthorizationModule
  ],
  providers: [
   //...
   {
      provide: PERMISSION_PROVIDER,
      useClass: MyPermissionProvider
    },
  ],
  exports: [
    AuthorizationModule,
    PERMISSION_PROVIDER
  ]
})
export class AppModule { }
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
