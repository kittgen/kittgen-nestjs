# Kittgen. For Nestjs.

## Description

Kittgen is a set of libraries and code generators. In this repository you can find all things related to [Nestjs](https://nestjs.com/).

## Available Modules

- [@kittgen/nestjs-authorization](packages/nestjs-authorization/README.md): A permission based authorization library
- [@kittgen/nestjs-https-redirect](packages/nestjs-https-redirect/README.md): HTTPS redirect middleware
- [@kittgen/nestjs-fluent-logger](packages/nestjs-fluent-logger/README.md): KeyValue Logger with obfuscating functionality 

## Library Development

### Choose your package

e.g. for nestjs-authorization

```bash
cd packages/nestjs-authorization
npm install
npm run build
```

### Choose your example project

Example projects are used to show the usage of the libraries.

e.g. for `my-nest-project`

```bash
cd example-apps/my-nestjs-project
# local libraries will be loaded through the npm `file` command
npm install
npm run start:dev
```

## License

Kittgen is licensed under MIT. See LICENSE.

## Authors

Kittgen is developed by Otto von Wesendonk and Edgar Müller.
