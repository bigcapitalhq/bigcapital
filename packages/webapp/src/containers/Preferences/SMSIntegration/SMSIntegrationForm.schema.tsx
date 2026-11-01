import * as Yup from 'yup';

const Schema = Yup.object().shape({
  smsIntegration: Yup.object({
    twilioAccountSid: Yup.string().nullable(),
    twilioAuthToken: Yup.string().nullable(),
    twilioFromNumber: Yup.string().nullable(),
  }),
});

export const SMSIntegrationFormSchema = Schema;
