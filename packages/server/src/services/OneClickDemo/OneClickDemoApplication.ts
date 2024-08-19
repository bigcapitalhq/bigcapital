import { Inject, Service } from "typedi";
import { CreateOneClickDemo } from "./CreateOneClickDemo";


@Service()
export class OneClickDemoApplication {

  @Inject()
  private createOneClickDemoService: CreateOneClickDemo;

  public createOneClick() {
    return this.createOneClickDemoService.createOneClickDemo();
  }
}