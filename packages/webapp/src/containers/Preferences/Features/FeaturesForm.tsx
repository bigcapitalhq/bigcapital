import { Button, Intent } from '@blueprintjs/core';
import { Form, useFormikContext } from 'formik';
import React from 'react';
import { useHistory } from 'react-router-dom';
import type { FeaturesFormValues } from './types';
import {
  FormattedMessage as T,
  CardFooterActions,
  FFormGroup,
  FSwitch,
} from '@/components';

/**
 * Features preferences form.
 */
export function FeaturesForm() {
  const history = useHistory();
  const { isSubmitting } = useFormikContext<FeaturesFormValues>();

  const handleCloseClick = () => {
    history.go(-1);
  };

  return (
    <Form>
      {/* ----------- Landed Cost ----------- */}
      <FFormGroup
        name={'features.landedCost'}
        inline={true}
        helperText={<T id={'features.landed_cost.helper_text'} />}
      >
        <FSwitch
          name={'features.landedCost'}
          labelElement={<T id={'features.landed_cost'} />}
          large={true}
        />
      </FFormGroup>

      {/* ----------- Sales Tax ----------- */}
      <FFormGroup
        name={'features.salesTax'}
        inline={true}
        helperText={<T id={'features.sales_tax.helper_text'} />}
      >
        <FSwitch
          name={'features.salesTax'}
          labelElement={<T id={'features.sales_tax'} />}
          large={true}
        />
      </FFormGroup>

      {/* ----------- SMS Notifications ----------- */}
      <FFormGroup
        name={'features.smsNotifications'}
        inline={true}
        helperText={<T id={'features.sms_notifications.helper_text'} />}
      >
        <FSwitch
          name={'features.smsNotifications'}
          labelElement={<T id={'features.sms_notifications'} />}
          large={true}
        />
      </FFormGroup>

      <CardFooterActions>
        <Button intent={Intent.PRIMARY} loading={isSubmitting} type="submit">
          <T id={'save'} />
        </Button>
        <Button disabled={isSubmitting} onClick={handleCloseClick}>
          <T id={'close'} />
        </Button>
      </CardFooterActions>
    </Form>
  );
}
