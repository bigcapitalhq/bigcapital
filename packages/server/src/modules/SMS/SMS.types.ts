export interface SmsJobPayload {
  to: string;
  body: string;
  organizationId: string;
  userId: number;
}

export interface SmsCredentials {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}
