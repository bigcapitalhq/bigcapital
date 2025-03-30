import { Module } from '@nestjs/common';
import { AuthService } from './AuthService';
import { AuthController } from './Auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './Jwt.strategy';
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

const models = [RegisterTenancyModel(PasswordReset)];

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: 'asdfasdfasdf',
      signOptions: { expiresIn: '60s' },
    }),
    TenantDBManagerModule,
    ...models,
  ],
  exports: [...models],
  providers: [
    AuthService,
    JwtStrategy,
    AuthenticationApplication,
    AuthSendResetPasswordService,
    AuthResetPasswordService,
    AuthSignupConfirmResendService,
    AuthSignupConfirmService,
    AuthSignupService,
    AuthSigninService,
    AuthenticationMailMesssages,
  ],
})
export class AuthModule {}
