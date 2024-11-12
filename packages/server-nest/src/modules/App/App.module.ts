import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { join } from 'path';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { BullModule } from '@nestjs/bullmq';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClsModule } from 'nestjs-cls';
import { AppController } from './App.controller';
import { AppService } from './App.service';
import { ItemsModule } from '../Items/items.module';
import { config } from '../../common/config';
import { SystemDatabaseModule } from '../System/SystemDB/SystemDB.module';
import { SystemModelsModule } from '../System/SystemModels/SystemModels.module';
import { JwtStrategy } from '../Auth/Jwt.strategy';
import { jwtConstants } from '../Auth/Auth.constants';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { TenancyModelsModule } from '../Tenancy/TenancyModels/Tenancy.module';
import { LoggerMiddleware } from '@/middleware/logger.middleware';
import { ExcludeNullInterceptor } from '@/interceptors/ExcludeNull.interceptor';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from '../Auth/Jwt.guard';
import { UserIpInterceptor } from '@/interceptors/user-ip.interceptor';
import { TenancyGlobalMiddleware } from '../Tenancy/TenancyGlobal.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: config,
      isGlobal: true,
    }),
    SystemDatabaseModule,
    SystemModelsModule,
    EventEmitterModule.forRoot(),
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: join(__dirname, '/../../i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        new QueryResolver(),
        new HeaderResolver(),
        new CookieResolver(),
        AcceptLanguageResolver,
      ],
    }),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('QUEUE_HOST'),
          port: configService.get('QUEUE_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        setup: (cls, req: Request, res: Response) => {
          cls.set('organizationId', req.headers['organization-id']);
          cls.set('userId', 1);
        },
      },
    }),
    TenancyDatabaseModule,
    TenancyModelsModule,
    ItemsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UserIpInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ExcludeNullInterceptor,
    },
    AppService,
    JwtStrategy,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    consumer
      .apply(TenancyGlobalMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
