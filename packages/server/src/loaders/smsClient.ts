import SMSClient from '@/services/SMSClient';
import EasySMSGateway from '@/services/SMSClient/EasySmsClient';

export default (token: string) => {
  const easySmsGateway = new EasySMSGateway(token);
  const smsClient = new SMSClient(easySmsGateway);
  
  return smsClient;
};
