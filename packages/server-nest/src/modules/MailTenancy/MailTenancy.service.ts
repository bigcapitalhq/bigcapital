import { Injectable } from '@nestjs/common';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailTenancy {
  constructor(
    private readonly tenancyContext: TenancyContext,
    private readonly config: ConfigService
  ) {}

  /**
   * Retrieves the senders mails of the given tenant.
   */
  public async senders() {
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();
    const from = this.config.get('mail.from');

    return [
      {
        mail: from,
        label: tenantMetadata.name,
        primary: true,
      }
    ].filter((item) => item.mail)
  }
}