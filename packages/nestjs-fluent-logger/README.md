# Kittgen Nestjs Key Value FluentLogger

Key Value Logger with support for redaction


[Check the main page for Kittgen](https://github.com/kittgen/kittgen-nestjs) for further information.

## Usage

### Installation

```bash
npm i @kittgen/nestjs-fluent-logger
```

### Using Fluent Key Value API
Example usage of logger

#### Log Example
```ts
import { FluentLogger } from '@kittgen/nestjs-fluent-logger';

class EmailService {
  constructor() {
    const logger = new FluentLogger(EmailService.name)
  }
  // ...
  logger.fluent()
        .add('send', 'email')
        .add('success', true)
        .addRedacted('userId', '123123', half)
        .addRedacted('to', 'johndoe@example.com', emailLocalHalf)
        .add('templateName', 'my-email-template')
        .log()
  //...
}
```

logs

```bash
[Nest] 7554 - 01/17/2021, 9:10:31 PM   [EmailService] send=email success=true userId=███123 to=████doe@example.com templateName=my-email-template
```

#### Loglevels

FluentLogger supports same log levels as the Nest logger.

```ts
  logger.fluent()
        .add('success', true)
        .log() //.error() , .warn(), .debug(), .verbose()
```
#### Context

It accepts the same arguments as Nest, like e.g. Context. Just without the message part, which is generated through the key value pairs.

```ts
  logger.fluent()
        .add('success', true)
        .log(myContext)
```

### Redaction Strategies
This package comes with a set of predefined redaction strategies. You can also provide you own.

| Strategy        | Description                                | Using                                         | Redacts to    |
| --------------  |------------------------------------------- |---------------------------------------------- | --------------|
| fully (default) | redacts every char with a Bar              | .addRedacted('to','Eddy')                     | ████          |
| half            | same as firstHalf                          | .addRedacted('to','Eddy', half)               | ██dy          |
| firstHalf       | redacts the first half with bars           | .addRedacted('to','Eddy', firstHalf)          | ██dy          |
| lastHalf        | redacts the last half with bars            | .addRedacted('to','Eddy', lastHalf)           | Ed██          |
| replaceWith     | redacts with specified replacement         | .addRedacted('to','Eddy', replaceWith('❤️')) |  ❤️           |
| emailLocal      | redacts local part of email                | .addRedacted('to','Ed@ab.c', emailLocal)      | ██@ab.c       |
| emailLocalHalf  | redacts first half of local part of email  | .addRedacted('to','Ed@ab.c', emailLocalHalf)  | █d@ab.c       |
| emailDomain     | redacts domain part of email               | .addRedacted('to','Ed@ab.c', emailDomain)     | Ed@███        |
| emailDomainHalf | redacts first half of domain part of email | .addRedacted('to','Ed@ab.c', emailDomainHalf) | Ed@██.c       |

#### Redaction strategies Composition
It is possible to compose redaction strategies, e.g.:

```ts
logger.fluent()
        .add('email','eddy@example.com', emailLocalHalf, emailDomainHalf) // this redacts  eddy@example.com to ██dy@██████le.com
        .log()
```

### Usage as normal Nest Logger
FluentLogger is an extension of the default [Nest Logger](https://docs.nestjs.com/techniques/logger) and supports all it's features.

```ts
import { FluentLogger } from '@kittgen/nestjs-fluent-logger';

const logger = new FluentLogger()
logger.log('hello world')
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
