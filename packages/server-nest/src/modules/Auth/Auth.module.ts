import { Module } from '@nestjs/common';
import { AuthController } from './Auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/Jwt.strategy';
import { AuthenticationApplication } from './AuthApplication.sevice';
import { AuthSendResetPasswordService } from './commands/AuthSendResetPassword.service';
import { AuthResetPasswordService } from './commands/AuthResetPassword.service';
import { AuthSignupConfirmResendService } from './commands/AuthSignupConfirmResend.service';
import { AuthSignupConfirmService } from './commands/AuthSignupConfirm.service';
import { AuthSignupService } from './commands/AuthSignup.service';
import { AuthSigninService } from './commands/AuthSignin.service';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { PasswordReset } from './models/PasswordReset';
import { TenantDBManagerModule } from '../TenantDBManager/TenantDBManager.module';
import { AuthenticationMailMesssages } from './AuthMailMessages.esrvice';
import { LocalStrategy } from './strategies/Local.strategy';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/Jwt.local';

const models = [RegisterTenancyModel(PasswordReset)];

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      signOptions: {
        expiresIn: '1d',
        algorithm: 'HS384',
      },
      verifyOptions: {
        algorithms: ['HS384'],
      },
    }),
    TenantDBManagerModule,
    ...models,
  ],
  exports: [...models],
  providers: [
    LocalStrategy,
    JwtStrategy,
    AuthenticationApplication,
    AuthSendResetPasswordService,
    AuthResetPasswordService,
    AuthSignupConfirmResendService,
    AuthSignupConfirmService,
    AuthSignupService,
    AuthSigninService,
    AuthenticationMailMesssages,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
