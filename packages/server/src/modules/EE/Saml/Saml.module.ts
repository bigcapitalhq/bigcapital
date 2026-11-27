import { Global, Module } from '@nestjs/common';
import { AuthModule } from '@/modules/Auth/Auth.module';
import { OrganizationSigninPolicy } from '@/modules/Auth/OrganizationSigninPolicy';
import { TenancyModule } from '@/modules/Tenancy/Tenancy.module';
import { OrganizationSamlController } from './OrganizationSaml.controller';
import { SamlController } from './Saml.controller';
import { SamlProtocolService } from './SamlProtocol.service';
import { SamlSettingsService } from './SamlSettings.service';
import { SamlSigninService } from './SamlSignin.service';

@Global()
@Module({
  imports: [AuthModule, TenancyModule],
  controllers: [OrganizationSamlController, SamlController],
  providers: [
    SamlProtocolService,
    SamlSettingsService,
    SamlSigninService,
    { provide: OrganizationSigninPolicy, useExisting: SamlSettingsService },
  ],
  exports: [OrganizationSigninPolicy],
})
export class SamlModule {}
