# Kittgen Nestjs HTTPS redirect middleware

HTTPS redirect middleware for Nestjs.

[Check the main page for Kittgen](../../README.md) for further information.

## Usage

### Installation

```bash
npm i @kittgen/nestjs-https-redirect
```

### Register your middleware

#### Add Middleware to ApplicationModule

Further explanations about middlewares can be found in the [Nestjs documentation](https://docs.nestjs.com/middleware#applying-middleware).

```ts
export class ApplicationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpsRedirectMiddleware({ enabled: true })).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
```
#### Reverse Proxys

If you're behind a reverse proxy (e.g. Heroku or nginx) make sure to enable `trust proxy` for your express app:

```js
app.enable('trust proxy');
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
