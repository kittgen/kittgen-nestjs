import { Logger } from '@nestjs/common';
import { fully } from './redaction';

export class FluentLogger extends Logger {
  readonly keyValueSeperator: string;
  readonly entrySeperator: string;
  readonly stringQuote: string;

  constructor(
    context?: string,
    isTimestampEnabled?: boolean,
    options?: FluentLoggerOptions
  ) {
    super(context, isTimestampEnabled);
    this.keyValueSeperator = options?.keyValueSeperator || '=';
    this.entrySeperator = options?.entrySeperator || ' ';
    this.stringQuote = options?.stringQuote || '"';
  }

  fluent() {
    return new FluentLogBuilder(this);
  }
}
export interface FluentLoggerOptions {
  readonly keyValueSeperator?: string;
  readonly entrySeperator?: string;
  readonly stringQuote?: string;
}

export class FluentLogBuilder {
  private entries: string[][] = [];

  constructor(readonly logger: FluentLogger) {}

  add(key: string, value: any): FluentLogBuilder {
    this.entries.push([key, String(value)]);
    return this;
  }

  addRedacted(
    key: string,
    value: any,
    ...strategies: ((value: any) => string)[]
  ): FluentLogBuilder {
    if (!strategies || strategies.length == 0) {
      this.add(key, fully(value));
      return this;
    }

    this.add(key, composeFn(...strategies)(value));
    return this;
  }

  asRaw() {
    return this.entries;
  }

  asString() {
    return this.entries
      .map(entry => entry.join(this.logger.keyValueSeperator))
      .join(this.logger.entrySeperator);
  }

  error(trace?: string, context?: string): void {
    this.logger.error(this.asString(), trace, context);
  }

  log(context?: string): void {
    this.logger.log(this.asString(), context);
  }

  warn(context?: string): void {
    this.logger.warn(this.asString(), context);
  }

  debug(context?: string): void {
    this.logger.debug(this.asString(), context);
  }

  verbose(context?: string): void {
    this.logger.verbose(this.asString(), context);
  }
}

const composeFn = (...functions: any[]) => (args: any) =>
  functions.reduceRight((arg, fn) => fn(arg), args);
