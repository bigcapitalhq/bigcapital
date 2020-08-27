import SMSClient from '@/services/SMSClient';
import EasySMSGateway from '@/services/SMSClient/EasySMSClient';

export default () => {
  const easySmsGateway = new EasySMSGateway();
  const smsClient = new SMSClient(easySmsGateway);
  
  return smsClient;
};
