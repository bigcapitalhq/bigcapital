import { Inject, Service } from 'typedi';
import { CreateOneClickDemo } from './CreateOneClickDemo';

@Service()
export class OneClickDemoApplication {
  @Inject()
  private createOneClickDemoService: CreateOneClickDemo;
  
  /**
   *
   * @returns
   */
  public createOneClick() {
    return this.createOneClickDemoService.createOneClickDemo();
  }

  /**
   *
   * @param oneClickDemoId
   * @returns
   */
  public autoSignIn(oneClickDemoId: string) {
    return this.createOneClickDemoService.autoSignIn(oneClickDemoId);
  }
}
