import { Inject, Service } from 'typedi';
import { faker } from '@faker-js/faker';
import AuthenticationApplication from '../Authentication/AuthApplication';
import OrganizationService from '../Organization/OrganizationService';
import { IAuthSignInPOJO } from '@/interfaces';

@Service()
export class CreateOneClickDemo {
  @Inject()
  private authApp: AuthenticationApplication;

  @Inject()
  private organizationService: OrganizationService;

  /**
   * Creates one-click demo account.
   * @returns {Promise<ICreateOneClickDemoPOJO>}
   */
  async createOneClickDemo(): Promise<ICreateOneClickDemoPOJO> {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const password = '123123123';

    await this.authApp.signUp({ firstName, lastName, email, password });

    // 
    const signedIn = await this.authApp.signIn(email, password);
    const tenantId = signedIn.tenant.id;

    const buildJob = await this.organizationService.buildRunJob(
      tenantId,
      {
        name: 'BIGCAPITAL, INC',
        base_currency: 'USD',
        location: 'US',
        language: 'en',
        fiscal_year: 'march',
        timezone: 'US/Central',
      },
      signedIn.user
    );
    return { email, signedIn, buildJob };
  }

  /**
   * Sign-in automicatlly using the demo id one creating an account finish.
   * @param {string} oneClickDemoId -
   */
  async autoSignIn(oneClickDemoId: string) {}
}

interface ICreateOneClickDemoPOJO {
  email: string;
  signedIn: IAuthSignInPOJO;
  buildJob: any;
}
