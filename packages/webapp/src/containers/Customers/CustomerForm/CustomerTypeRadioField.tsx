import { Button, ButtonGroup } from '@blueprintjs/core';
import { FastField } from 'formik';
import intl from 'react-intl-universal';
import { FFormGroup } from '@/components';

/**
 * Customer type selector (button group).
 */
export function CustomerTypeRadioField() {
  return (
    <FFormGroup
      name={'customerType'}
      label={intl.get('customer_type')}
      inline
      fastField
    >
      <FastField name="customerType">
        {({
          field,
          form,
        }: {
          field: { value: string };
          form: {
            setFieldValue: (name: string, value: string) => void;
            setFieldTouched: (name: string, touched: boolean) => void;
          };
        }) => (
          <ButtonGroup>
            <Button
              type="button"
              outlined
              small
              active={field.value === 'business'}
              onClick={() => {
                form.setFieldValue('customerType', 'business');
                form.setFieldTouched('customerType', true);
              }}
            >
              {intl.get('business')}
            </Button>
            <Button
              type="button"
              outlined
              small
              active={field.value === 'individual'}
              onClick={() => {
                form.setFieldValue('customerType', 'individual');
                form.setFieldTouched('customerType', true);
              }}
            >
              {intl.get('individual')}
            </Button>
          </ButtonGroup>
        )}
      </FastField>
    </FFormGroup>
  );
}
