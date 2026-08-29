// @ts-nocheck
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
        type={'switch'}
        inline={true}
        helperText={<T id={'features.landed_cost.helper_text'} />}
      >
        <FSwitch
          name={'features.landedCost'}
          label={<T id={'features.landed_cost'} />}
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
