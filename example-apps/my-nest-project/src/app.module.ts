import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizationModule } from '@kittgen/nestjs-authorization';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IsAuthor } from './is-author.condition';
import { AuthnGuard } from './authn.guard';
import { InMemoryPermissionProvider } from './in-memory-permission.provider';

@Module({
  imports: [AuthorizationModule],
  controllers: [AppController],
  providers: [AppService, IsAuthor, {
    provide: 'PERMISSION_PROVIDER',
    useClass: InMemoryPermissionProvider
  }, {
    provide: APP_GUARD,
    useClass: AuthnGuard
  }],
})
export class AppModule {}
