
export default interface SMSClientInterface {
  clientName: string;
  send(to: string, message: string): boolean;
}