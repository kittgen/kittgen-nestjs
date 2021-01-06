import { Module } from '@nestjs/common';
import { AuthorizationModule, NopPermissionProvider, PermissionProvider } from '@kittgen/nestjs-authorization';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AuthorizationModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: PermissionProvider,
    useClass: NopPermissionProvider
  }],
})
export class AppModule {}
