import { Module } from '@nestjs/common';
import { AbstractPermissionProvider, AuthorizationModule, NoopPermissionProvider } from '@kittgen/nestjs-authorization';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AuthorizationModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: AbstractPermissionProvider,
    useClass: NoopPermissionProvider
  }],
})
export class AppModule {}
