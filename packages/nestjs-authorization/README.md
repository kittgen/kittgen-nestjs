# Kittgen Nestjs Authorization

Permission based authorization for Nestjs.

[Check the main page for Kittgen](../../README.md) for further information.

## Usage

TODO

### Annotate your controllers

```ts
@Get(':id')
@AuthAction([ArticleAuthAction.Read])
findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
}
```

### Implement PermissionProvider

...

## Local Library Development

### Importand Commands
```bash

# start in watcher mode
npm start

# builds to the 'dist' folder
npm run build

# runs the tests
npm test

```

### Commits

We use [commitlint](https://commitlint.js.org/) for nice commit messages and automated versioning/changelog.

Example commit messages:
- `feat: TOOL-67 init template`
- `chore: TOOL-67 init template`


This packages uses [TSDX](https://github.com/jaredpalmer/tsdx).

## License

Kittgen is licensed under MIT. See LICENSE.

## Authors

Kittgen is developed by Otto von Wesendonk and Edgar Müller.