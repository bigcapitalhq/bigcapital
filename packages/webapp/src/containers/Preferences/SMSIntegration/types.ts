export interface SMSIntegrationFormValues {
  smsIntegration: {
    twilioAccountSid: string;
    twilioAuthToken: string;
    twilioFromNumber: string;
    isEnvCredentialsActive?: boolean;
  };
}
