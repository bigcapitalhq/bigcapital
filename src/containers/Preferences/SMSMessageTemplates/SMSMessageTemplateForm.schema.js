import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from 'common/dataTypes';
import { isBlank } from 'utils';

const Schema = Yup.object().shape({

  entries: Yup.array().of(
    Yup.object().shape({
      notification: Yup.string().nullable(),
      service: Yup.number().nullable(),
      message: Yup.string().max(DATATYPES_LENGTH.TEXT).nullable(),
      auto:Yup.boolean(),
      switch:Yup.boolean(),
     
    }),
  ),
})
export const CreateSMSMessageTemplateSchema = Schema;
