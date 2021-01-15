import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {
  AuthorizationModule,
  PERMISSION_PROVIDER,
} from '@kittgen/nestjs-authorization';
import { HttpsRedirectMiddleware } from '@kittgen/nestjs-https-redirect';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IsAuthor } from './is-author.condition';
import { AuthnGuard } from './authn.guard';
import { InMemoryPermissionProvider } from './in-memory-permission.provider';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthorizationModule, UsersModule],
  controllers: [AppController],
  providers: [
    AppService,
    IsAuthor,
    {
      provide: PERMISSION_PROVIDER,
      useClass: InMemoryPermissionProvider,
    },
    {
      provide: APP_GUARD,
      useClass: AuthnGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpsRedirectMiddleware({ enabled: false })).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
