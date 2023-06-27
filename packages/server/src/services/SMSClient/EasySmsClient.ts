import axios from 'axios';
import SMSClientInterface from '@/services/SMSClient/SMSClientInterfaces';
import config from '@/config';

export default class EasySMSClient implements SMSClientInterface {
  token: string;
  clientName: string = 'easysms';

  /**
   *
   * @param {string} token
   */
  constructor(token: string) {
    this.token = token;
  }

  /**
   * Normalizes the phone number string.
   * @param {string} phoneNumber
   * @returns {string}
   */
  normalizePhoneNumber = (phoneNumber: string) => {
    let normalized = phoneNumber;

    normalized = normalized.replace(/^00/, '');
    normalized = normalized.replace(/^0/, '');
    normalized = normalized.replace(/^218/, '');

    return normalized;
  };

  /**
   * Send message to given phone number via easy SMS client.
   * @param {string} to
   * @param {string} message
   */
  send = (to: string, message: string) => {
    const API_KEY = this.token;
    const parsedTo = this.normalizePhoneNumber(to);
    const encodedMessage = encodeURIComponent(message);
    const encodeTo = encodeURIComponent(parsedTo);

    const params = `action=send-sms&api_key=${API_KEY}&to=${encodeTo}&sms=${encodedMessage}&unicode=1`;

    return new Promise((resolve, reject) => {
      axios
        .get(`https://easysms.devs.ly/sms/api?${params}`)
        .then((response) => {
          if (response.data.code === 'ok') {
            resolve(response);
          } else {
            reject(response.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
