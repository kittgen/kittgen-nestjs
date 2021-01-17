import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { HttpsRedirectMiddleware } from '@kittgen/nestjs-https-redirect';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IsAuthor } from './is-author.condition';
import { AuthnGuard } from './authn.guard';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [
    AppService,
    IsAuthor,
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
