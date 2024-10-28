import { useFormikContext } from 'formik';
import { chain } from 'lodash';
import { InvoiceSendMailFormValues } from './_types';

export const useInvoiceMailItems = () => {
  const { values } = useFormikContext<InvoiceSendMailFormValues>();
  const cc = values?.cc || [];
  const bcc = values?.bcc || [];

  return chain([...values?.to, ...cc, ...bcc])
    .filter((email) => !!email?.trim())
    .uniq()
    .map((email) => ({
      value: email,
      text: email,
    }))
    .value();
};
