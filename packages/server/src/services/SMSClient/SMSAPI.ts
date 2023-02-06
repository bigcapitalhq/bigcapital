import { Container } from 'typedi';
import SMSClientInterface from '@/services/SMSClient/SMSClientInterface';
import { thomsonCrossSectionDependencies } from 'mathjs';

export default class SMSAPI {
  smsClient: SMSClientInterface;

  constructor(smsClient: SMSClientInterface) {
    this.smsClient = smsClient;
  }

  /**
   * Sends the message to the target via the client.
   * @param {string} to
   * @param {string} message
   * @param {array} extraParams
   * @param {array} extraHeaders
   */
  sendMessage(
    to: string,
    message: string,
    extraParams?: [],
    extraHeaders?: []
  ) {
    return this.smsClient.send(to, message);
  }

  /**
   * 
   * @param to 
   * @param message 
   * @returns 
   */
  sendMessageJob(to: string, message: string) {
    const agenda = Container.get('agenda');

    return agenda.now('sms-notification', { to, message });
  }
}
