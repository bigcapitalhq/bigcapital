// @ts-nocheck
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  resource: Yup.string().required().label('Resource'),
  format: Yup.string().required().label('Format'),
});

export const ExportDialogFormSchema = Schema;
