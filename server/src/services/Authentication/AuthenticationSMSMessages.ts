import { Service, Inject } from "typedi";
import { ISystemUser, ITenant } from "@/interfaces";

@Service()
export default class AuthenticationSMSMessages {
  @Inject('SMSClient')
  smsClient: any;

  /**
   * Sends welcome sms message.
   * @param {ITenant} tenant 
   * @param {ISystemUser} user 
   */
  sendWelcomeMessage(tenant: ITenant, user: ISystemUser) {
    const message: string = `Hi ${user.firstName}, Welcome to Bigcapital, You've joined the new workspace, if you need any help please don't hesitate to contact us.`

    return this.smsClient.sendMessage(user.phoneNumber, message);
  }
}