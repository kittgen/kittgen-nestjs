import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpsRedirectMiddleware } from '@kittgen/nestjs-https-redirect';
import { TypeOrmHistoryModule } from '@kittgen/nestjs-typeorm-history';
import { AuthorizationModule } from '@kittgen/nestjs-authorization';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IsAuthor } from './is-author.condition';
import { AuthnGuard } from './authn.guard';
import { UsersModule } from './users/users.module';
import { InMemoryPermissionProvider } from './common/in-memory-permission.provider';
import { UsersService } from './users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UserHistory } from './users/user-history.entity';
import { AllExceptionFiler } from './all-exception.filter';

@Module({
  imports: [
    AuthorizationModule.registerAsync({
      imports: [UsersModule],
      inject: [UsersService],
      useFactory: (userService: UsersService) => {
        return {
          permissionProvider: new InMemoryPermissionProvider(userService),
        };
      },
    }),
    UsersModule,
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'password',
          database: 'my-nest-project',
          entities: [User, UserHistory],
          synchronize: true,
        };
      },
    }),
    TypeOrmHistoryModule.register({
      entities: [
        {
          entity: User,
          history: UserHistory,
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    IsAuthor,
    {
      provide: APP_GUARD,
      useClass: AuthnGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFiler,
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
