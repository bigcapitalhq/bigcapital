import axios from 'axios';
import SMSClientInterface from 'services/SMSClient/SMSClientInterfaces';
import config from 'config';

export default class EasySMSClient implements SMSClientInterface {
  clientName: string = 'easysms';

  /**
   * Send message to given phone number via easy SMS client.
   * @param {string} to 
   * @param {string} message 
   */
  send(to: string, message: string) {
    const API_KEY = config.easySMSGateway.api_key;
    const params = `action=send-sms&api_key=${API_KEY}=&to=${to}&sms=${message}&unicode=1`;

    return new Promise((resolve, reject) => {
      axios.get(`https://easysms.devs.ly/sms/api?${params}`)
        .then((response) => {
          if (response.data.code === 'ok') { resolve(); }
          else { reject(response.data); }
        })
        .catch((error) => { reject(error) });
    });
  }
}