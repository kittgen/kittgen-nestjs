import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { HttpsRedirectMiddlewareOptions } from './https-redirect-middleware-options.interface';

@Injectable()
export class HttpsRedirectMiddleware implements NestMiddleware {
  constructor(
    readonly options: HttpsRedirectMiddlewareOptions = { enabled: true }
  ) {}

  use(req: any, res: any, next: () => void) {
    const enabled = this.options.enabled;

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
