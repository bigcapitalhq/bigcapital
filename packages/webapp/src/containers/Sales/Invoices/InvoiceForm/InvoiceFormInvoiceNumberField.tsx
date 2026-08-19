import { Position, ControlGroup } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import type { InvoiceFormValues } from './utils';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  FFormGroup,
  FormattedMessage as T,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
  FInputGroup,
} from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';
import { useInvoiceFormContext } from './InvoiceFormProvider';

type InvoiceFormInvoiceNumberFieldProps = {
  openDialog: WithDialogActionsProps['openDialog'];
};

/**
 * Invoice number field of invoice form.
 */
export const InvoiceFormInvoiceNumberField = compose(withDialogActions)(({
  // #withDialogActions
  openDialog,
}: InvoiceFormInvoiceNumberFieldProps) => {
  // Formik context.
  const { values, setFieldValue } = useFormikContext<InvoiceFormValues>();
  const { invoiceSettings } = useInvoiceFormContext();
  const invoiceAutoIncrement = invoiceSettings?.autoIncrement as
    | boolean
    | undefined;

  // Handle invoice number changing.
  const handleInvoiceNumberChange = () => {
    openDialog(DialogsName.InvoiceNumberSettings);
  };
  // Handle invoice no. field blur.
  const handleInvoiceNoBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    // Show the confirmation dialog if the value has changed and auto-increment
    // mode is enabled.
    if (values.invoiceNo !== newValue && invoiceAutoIncrement) {
      openDialog(DialogsName.InvoiceNumberSettings, {
        initialFormValues: {
          onceManualNumber: newValue,
          incrementMode: 'manual-transaction',
        },
      });
    }
    // Setting the invoice number to the form will be manually in case
    // auto-increment is disable.
    if (!invoiceAutoIncrement) {
      setFieldValue('invoiceNo', newValue);
      setFieldValue('invoiceNoManually', newValue);
    }
  };

  return (
    <FFormGroup
      name={'invoiceNo'}
      label={intl.get('invoice_no')}
      labelInfo={<FieldRequiredHint />}
      inline={true}
      fastField={true}
    >
      <ControlGroup fill={true}>
        <FInputGroup
          name={'invoiceNo'}
          data-testId={'invoice-number-input'}
          onBlur={handleInvoiceNoBlur}
          onChange={() => {}}
        />
        <InputPrependButton
          buttonProps={{
            onClick: handleInvoiceNumberChange,
            icon: <Icon icon={'settings-18'} />,
          }}
          tooltip={true}
          tooltipProps={{
            content: <T id={'setting_your_auto_generated_invoice_number'} />,
            position: Position.BOTTOM_LEFT,
          }}
        />
      </ControlGroup>
    </FFormGroup>
  );
});
InvoiceFormInvoiceNumberField.displayName = 'InvoiceFormInvoiceNumberField';
