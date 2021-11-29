import * as Yup from 'yup';

const Schema = Yup.object().shape({
  token: Yup.string().required(),
});

export const CreateEasySMSIntegrationSchema = Schema;
