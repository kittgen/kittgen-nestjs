import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { HttpsRedirectMiddlewareOptions } from './https-redirect-middleware-options.interface';

export function HttpsRedirectMiddleware(
  options: HttpsRedirectMiddlewareOptions
): any {
  @Injectable()
  class HttpsRedirectMiddlewareCtor implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
      const enabled = options.enabled;

      if (!enabled) {
        next();
        return;
      }

      if (!req.secure) {
        const redirectUrl = `https://${req.hostname}${req.originalUrl}`;
        res.redirect(HttpStatus.PERMANENT_REDIRECT, redirectUrl);
      }
    }
  }
  return HttpsRedirectMiddlewareCtor;
}
