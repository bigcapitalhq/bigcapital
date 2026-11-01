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
import { PasswordReset } from './models/PasswordReset';
import { TenantDBManagerModule } from '../TenantDBManager/TenantDBManager.module';
import { AuthenticationMailMesssages } from './AuthMailMessages.esrvice';
import { LocalStrategy } from './strategies/Local.strategy';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthMailSubscriber } from './subscribers/AuthMail.subscriber';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullModule } from '@nestjs/bullmq';
import {
  SendResetPasswordMailQueue,
  SendSignupVerificationMailQueue,
  JWT_ISSUER,
  JWT_AUDIENCE,
} from './Auth.constants';
import { SendResetPasswordMailProcessor } from './processors/SendResetPasswordMail.processor';
import { SendSignupVerificationMailProcessor } from './processors/SendSignupVerificationMail.processor';
import { MailModule } from '../Mail/Mail.module';
import { ConfigService } from '@nestjs/config';
import { InjectSystemModel } from '../System/SystemModels/SystemModels.module';
import { UserTenant } from '../System/models/UserTenant.model';
import { GetAuthMetaService } from './queries/GetAuthMeta.service';
import { AuthedController } from './Authed.controller';
import { GetAuthenticatedAccount } from './queries/GetAuthedAccount.service';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { EnsureUserVerifiedGuard } from './guards/EnsureUserVerified.guard';
import { ApiKeyAuthGuard } from './api-key/AuthApiKey.guard';
import { MixedAuthGuard } from './api-key/MixedAuth.guard';
import { ApiKeyStrategy } from './api-key/AuthApiKey.strategy';
import { ApiKeyModel } from './models/ApiKey.model';
import { AuthApiKeysController } from './AuthApiKeys.controllers';
import { AuthApiKeyAuthorizeService } from './commands/AuthApiKeyAuthorization.service';
import { GenerateApiKey } from './commands/GenerateApiKey.service';
import { GetApiKeysService } from './queries/GetApiKeys.service';
import { UserTwoFactor } from './two-factor/models/UserTwoFactor.model';
import { UserTwoFactorRecoveryCode } from './two-factor/models/UserTwoFactorRecoveryCode.model';
import { TwoFactorChallenge } from './two-factor/models/TwoFactorChallenge.model';
import { TwoFactorCryptoService } from './two-factor/TwoFactorCrypto.service';
import { TwoFactorService } from './two-factor/TwoFactor.service';
import { TwoFactorChallengeService } from './two-factor/TwoFactorChallenge.service';
import { TwoFactorPolicyService } from './two-factor/TwoFactorPolicy.service';
import { TwoFactorSigninService } from './two-factor/TwoFactorSignin.service';
import { TwoFactorEnforcementGuard } from './two-factor/TwoFactorEnforcement.guard';
import { TwoFactorController } from './two-factor/TwoFactor.controller';
import { OrganizationTwoFactorController } from './two-factor/OrganizationTwoFactor.controller';

const models = [
  InjectSystemModel(PasswordReset),
  InjectSystemModel(ApiKeyModel),
  InjectSystemModel(UserTenant),
  InjectSystemModel(UserTwoFactor),
  InjectSystemModel(UserTwoFactorRecoveryCode),
  InjectSystemModel(TwoFactorChallenge),
];

@Module({
  controllers: [
    AuthController,
    AuthedController,
    AuthApiKeysController,
    TwoFactorController,
    OrganizationTwoFactorController,
  ],
  imports: [
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('jwt.secret');
        if (!secret) {
          throw new Error(
            'APP_JWT_SECRET is not configured. The server refuses to sign or verify tokens with a default secret. Generate a strong secret (e.g. `openssl rand -base64 48`) and set it as APP_JWT_SECRET in your environment or .env file.',
          );
        }
        return {
          secret,
          signOptions: {
            expiresIn: '1d',
            algorithm: 'HS384',
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
          },
          verifyOptions: {
            algorithms: ['HS384'],
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
          },
        };
      },
    }),
    TenantDBManagerModule,
    TenancyModule,
    BullModule.registerQueue({ name: SendResetPasswordMailQueue }),
    BullModule.registerQueue({ name: SendSignupVerificationMailQueue }),
    BullBoardModule.forFeature({
      name: SendResetPasswordMailQueue,
      adapter: BullMQAdapter,
    }),
    BullBoardModule.forFeature({
      name: SendSignupVerificationMailQueue,
      adapter: BullMQAdapter,
    }),
  ],
  exports: [...models, TwoFactorService],
  providers: [
    ...models,
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
    SendResetPasswordMailProcessor,
    SendSignupVerificationMailProcessor,
    GetAuthMetaService,
    GetAuthenticatedAccount,
    ApiKeyAuthGuard,
    ApiKeyStrategy,
    AuthApiKeyAuthorizeService,
    GenerateApiKey,
    GetApiKeysService,
    JwtAuthGuard,
    TwoFactorCryptoService,
    TwoFactorService,
    TwoFactorChallengeService,
    TwoFactorPolicyService,
    TwoFactorSigninService,
    {
      provide: APP_GUARD,
      useClass: MixedAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: EnsureUserVerifiedGuard,
    },
    // After the authentication guards above: needs the signed-in user.
    {
      provide: APP_GUARD,
      useClass: TwoFactorEnforcementGuard,
    },
    AuthMailSubscriber,
  ],
})
export class AuthModule {}
