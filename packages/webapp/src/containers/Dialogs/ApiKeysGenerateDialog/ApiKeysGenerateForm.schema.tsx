// @ts-nocheck
import * as Yup from 'yup';

export const CreateApiKeyFormSchema = Yup.object().shape({
  name: Yup.string()
    .max(255, 'Name must be at most 255 characters')
    .nullable(),
});

export default CreateApiKeyFormSchema;
