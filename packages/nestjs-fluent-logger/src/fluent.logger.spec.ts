import { emailDomainHalf, emailLocalHalf, half } from "./redaction";
import { FluentLogger } from "./fluent.logger";

describe('FluentLogger', () => {

    FluentLogger['printMessage'] = jest.fn().mockImplementation((..._args: any) => { })
    const internalLogMock = jest.spyOn(FluentLogger.prototype as any, 'callFunction')
        .mockImplementation((..._args: any) => { })

    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('should log as standard if not using fluent', () => {
        const logger = new FluentLogger()

        logger.log('hi')

        expect(internalLogMock).toHaveBeenCalledWith('log', 'hi', undefined)
    })

    describe('with fluent()', () => {
        it('should log simple key value pair', () => {
            const logger = new FluentLogger()

            logger.fluent()
                .add('say', 'hi')
                .log()

            expect(internalLogMock).toHaveBeenCalledWith('log', 'say=hi', undefined)
        })

        it('should log empty string with no key value pair', () => {
            const logger = new FluentLogger()

            logger.fluent()
                .log()

            expect(internalLogMock).toHaveBeenCalledWith('log', '', undefined)
        })

        it('should support multile key value pairs', () => {
            const logger = new FluentLogger()

            logger.fluent()
                .add('say','hi')
                .add('to', 'Eddy')
                .log()

            expect(internalLogMock).toHaveBeenCalledWith('log', 'say=hi to=Eddy', undefined)
        })

        it('should allow null', () => {
            const logger = new FluentLogger()

            logger.fluent()
                .add('say',null)
                .log()

            expect(internalLogMock).toHaveBeenCalledWith('log', 'say=null', undefined)
        })

        it('should redact when used', () => {
            const logger = new FluentLogger()

            logger.fluent()
                .add('say','hi')
                .addRedacted('to', 'Eddy')
                .log()

            expect(internalLogMock).toHaveBeenCalledWith('log', 'say=hi to=████', undefined)
        })

        it('should use redact strategy when defined', () => {
            const logger = new FluentLogger()

            logger.fluent()
                .add('say','hi')
                .addRedacted('to', 'Eddy', half)
                .log()

            expect(internalLogMock).toHaveBeenCalledWith('log', 'say=hi to=██dy', undefined)
        })

        it('should compose redact strategies when defined', () => {
            const logger = new FluentLogger()

            logger.fluent()
                .add('say','hi')
                .addRedacted('to', 'eddy@a.c', emailLocalHalf, emailDomainHalf)
                .log()

            expect(internalLogMock).toHaveBeenCalledWith('log', 'say=hi to=██dy@██c', undefined)
        })


    })

})
