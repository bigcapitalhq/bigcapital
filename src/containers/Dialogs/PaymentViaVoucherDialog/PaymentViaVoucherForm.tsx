// @ts-nocheck
import React from 'react';
import { Button, FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import { Form, FastField, ErrorMessage, useFormikContext } from 'formik';
import { FormattedMessage as T } from '@/components';
import { compose } from 'redux';

import { CLASSES } from '@/constants/classes';
import { inputIntent } from '@/utils';
import { useAutofocus } from '@/hooks';

import withDialogActions from '@/containers/Dialog/withDialogActions';

/**
 * Payment via license form.
 */
function PaymentViaLicenseForm({
  // #withDialogActions
  closeDialog,
}) {
  // Formik context.
  const { isSubmitting } = useFormikContext();

  const licenseNumberRef = useAutofocus();

  // Handle close button click.
  const handleCloseBtnClick = () => {
    closeDialog('payment-via-voucher');
  };

  return (
    <Form>
      <div className={CLASSES.DIALOG_BODY}>
        <p>
          <T id={'payment_via_voucher.dialog.description'} />
        </p>

        <FastField name="license_code">
          {({ field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'voucher_number'} />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="license_code" />}
              className={'form-group--voucher_number'}
            >
              <InputGroup
                large={true}
                intent={inputIntent({ error, touched })}
                {...field}
                inputRef={(ref) => (licenseNumberRef.current = ref)}
              />
            </FormGroup>
          )}
        </FastField>
      </div>

      <div className={CLASSES.DIALOG_FOOTER}>
        <div className={CLASSES.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={handleCloseBtnClick} disabled={isSubmitting}>
            <T id={'close'} />
          </Button>

          <Button
            intent={Intent.PRIMARY}
            disabled={false}
            type="submit"
            loading={isSubmitting}
          >
            <T id={'submit'} />
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default compose(withDialogActions)(PaymentViaLicenseForm);
