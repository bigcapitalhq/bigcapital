import SMSClientInterface from '@/services/SMSClient/SMSClientInterface';

export default class SMSAPI {
  smsClient: SMSClientInterface;

  constructor(smsClient: SMSClientInterface){
    this.smsClient = smsClient;
  }

  sendMessage(to: string, message: string, extraParams: [], extraHeaders: []) {
    return this.smsClient.send(to, message);
  }
}