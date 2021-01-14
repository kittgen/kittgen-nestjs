import { HttpsRedirectMiddleware } from './https-redirect.middleware';

const createRequest = (secure: boolean) => ({
  header: () => (secure ? 'https' : 'http'),
  secure,
  hostname: 'example.com',
  originalUrl: '/foo',
});

const createResponse = () => ({
  redirect: jest.fn(),
});

describe('HttpsRedirectMiddleware', () => {
  let middleware: any;
  const next = jest.fn();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('when enabled', () => {
    beforeEach(() => {
      const ctor = HttpsRedirectMiddleware();
      middleware = new ctor();
    });

    it('should redirect unsecured request', () => {
      const req = createRequest(false);
      const res = createResponse();

      middleware.use(req, res, next);

      expect(res.redirect).toBeCalled();
      expect(res.redirect).toHaveBeenCalledWith(308, `https://example.com/foo`);
    });

    it('should NOT redirect secured request', () => {
      const req = createRequest(true);
      const res = createResponse();

      middleware.use(req, res, next);

      expect(res.redirect).not.toBeCalled();
    });
  });

  describe('when disabled', () => {
    beforeEach(() => {
      const ctor = HttpsRedirectMiddleware({ enabled: false });
      middleware = new ctor();
    });

    it('should NOT redirect unsecured request', () => {
      const req = createRequest(false);
      const res = createResponse();

      middleware.use(req, res, next);

      expect(res.redirect).not.toBeCalled();
    });

    it('should NOT redirect secured request', () => {
      const req = createRequest(true);
      const res = createResponse();

      middleware.use(req, res, next);

      expect(res.redirect).not.toBeCalled();
    });
  });
});
