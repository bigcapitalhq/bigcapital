import { Inject, Service } from 'typedi';
import { CreateOneClickDemo } from './CreateOneClickDemo';

@Service()
export class OneClickDemoApplication {
  @Inject()
  private createOneClickDemoService: CreateOneClickDemo;

  /**
   * Creates one-click demo account.
   * @returns {Promise<ICreateOneClickDemoPOJO>}
   */
  public createOneClick() {
    return this.createOneClickDemoService.createOneClickDemo();
  }

  /**
   * Auto-sign-in to created demo account.
   * @param {string} demoId -
   * @returns {Promise<IAuthSignInPOJO>}
   */
  public autoSignIn(demoId: string) {
    return this.createOneClickDemoService.autoSignIn(demoId);
  }
}
