import { emailDomainHalf, emailLocalHalf, half } from './redaction';
import { FluentLogger } from './fluent.logger';
import { ConsoleLogger } from '@nestjs/common';

describe('FluentLogger', () => {
  (FluentLogger['staticInstanceRef'] as ConsoleLogger)[
    'printMessages'
  ] = jest.fn().mockImplementation((..._args: any) => {});
  const internalLogMock = jest
    .spyOn(FluentLogger.prototype.localInstance as any, 'log')
    .mockImplementation((..._args: any) => {});

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should log as standard if not using fluent', () => {
    const logger = new FluentLogger();

    logger.log('hi');

    expect(internalLogMock).toHaveBeenCalledWith('hi');
  });

  describe('with fluent()', () => {
    it('should log simple key value pair', () => {
      const logger = new FluentLogger();

      logger
        .fluent()
        .add('say', 'hi')
        .log();

      expect(internalLogMock).toHaveBeenCalledWith('say=hi', undefined);
    });

    it('should log empty string with no key value pair', () => {
      const logger = new FluentLogger();

      logger.fluent().log();

      expect(internalLogMock).toHaveBeenCalledWith('', undefined);
    });

    it('should support multiple key value pairs', () => {
      const logger = new FluentLogger();

      logger
        .fluent()
        .add('say', 'hi')
        .add('to', 'Eddy')
        .log();

      expect(internalLogMock).toHaveBeenCalledWith('say=hi to=Eddy', undefined);
    });

    it('should allow null', () => {
      const logger = new FluentLogger();

      logger
        .fluent()
        .add('say', null)
        .log();

      expect(internalLogMock).toHaveBeenCalledWith('say=null', undefined);
    });

    it('should redact when used', () => {
      const logger = new FluentLogger();

      logger
        .fluent()
        .add('say', 'hi')
        .addRedacted('to', 'Eddy')
        .log();

      expect(internalLogMock).toHaveBeenCalledWith('say=hi to=████', undefined);
    });

    it('should use redact strategy when defined', () => {
      const logger = new FluentLogger();

      logger
        .fluent()
        .add('say', 'hi')
        .addRedacted('to', 'Eddy', half)
        .log();

      expect(internalLogMock).toHaveBeenCalledWith('say=hi to=██dy', undefined);
    });

    it('should compose redact strategies when defined', () => {
      const logger = new FluentLogger();

      logger
        .fluent()
        .add('say', 'hi')
        .addRedacted('to', 'eddy@a.c', emailLocalHalf, emailDomainHalf)
        .log();

      expect(internalLogMock).toHaveBeenCalledWith(
        'say=hi to=██dy@██c',
        undefined
      );
    });
  });
});
