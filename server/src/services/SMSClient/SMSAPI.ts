import SMSClientInterface from 'services/SMSClient/SMSClientInterface';

export default class SMSAPI {
  smsClient: SMSClientInterface;

  constructor(smsClient: SMSClientInterface){
    this.smsClient = smsClient;
  }

  /**
   * Sends the message to the target via the client.
   * @param {string} to 
   * @param {string} message 
   * @param {array} extraParams 
   * @param {array} extraHeaders 
   */
  sendMessage(to: string, message: string, extraParams?: [], extraHeaders?: []) {
    return this.smsClient.send(to, message);
  }
}