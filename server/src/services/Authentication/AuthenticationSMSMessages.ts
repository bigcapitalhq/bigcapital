import { Service } from "typedi";

@Service()
export default class AuthenticationSMSMessages {
  smsClient: any;

  sendWelcomeMessage() {
    const message: string = `Hi ${firstName}, Welcome to Bigcapital, You've joined the new workspace,
      if you need any help please don't hesitate to contact us.`

    
  }
}