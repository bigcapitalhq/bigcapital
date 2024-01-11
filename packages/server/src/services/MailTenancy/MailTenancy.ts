import config from '@/config';
import { Tenant } from "@/system/models";
import { Service } from 'typedi';


@Service()
export class MailTenancy {
  /**
   * Retrieves the senders mails of the given tenant.
   * @param {number} tenantId 
   */
  public async senders(tenantId: number) {
    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    return [
      {
        mail: config.mail.from,
        label: tenant.metadata.name,
        primary: true,
      }
    ].filter((item) => item.mail)
  }
}