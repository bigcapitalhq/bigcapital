import { Position, ControlGroup } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import type { EstimateFormValues } from './utils';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  FFormGroup,
  FInputGroup,
  FormattedMessage as T,
  Icon,
  InputPrependButton,
} from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';
import { useEstimateFormContext } from './EstimateFormProvider';

type EstimateNumberFieldProps = {
  openDialog: WithDialogActionsProps['openDialog'];
};

/**
 * Estimate number field of estimate form.
 */
export const EstimateFormEstimateNumberField = compose(withDialogActions)(({
  openDialog,
}: EstimateNumberFieldProps) => {
  const { values, setFieldValue } = useFormikContext<EstimateFormValues>();
  const { estimatesSettings } = useEstimateFormContext();
  const estimateAutoIncrement = estimatesSettings?.autoIncrement as
    | boolean
    | undefined;

  const handleEstimateNumberBtnClick = () => {
    openDialog('estimate-number-form', {});
  };
  // Handle estimate no. field blur.
  const handleEstimateNoBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    // Show the confirmation dialog if the value has changed and auto-increment
    // mode is enabled.
    if (values.estimateNumber !== newValue && estimateAutoIncrement) {
      openDialog('estimate-number-form', {
        initialFormValues: {
          onceManualNumber: newValue,
          incrementMode: 'manual-transaction',
        },
      });
    }
    // Setting the estimate number to the form will be manually in case
    // auto-increment is disable.
    if (!estimateAutoIncrement) {
      setFieldValue('estimateNumber', newValue);
      setFieldValue('estimateNumberManually', newValue);
    }
  };

  return (
    <FFormGroup
      name={'estimateNumber'}
      label={intl.get('estimate')}
      inline={true}
    >
      <ControlGroup fill={true}>
        <FInputGroup
          name={'estimateNumber'}
          data-testId={'estimate-number-input'}
          asyncControl={true}
          onBlur={handleEstimateNoBlur}
          onChange={() => {}}
        />
        <InputPrependButton
          buttonProps={{
            onClick: handleEstimateNumberBtnClick,
            icon: <Icon icon={'settings-18'} />,
          }}
          tooltip={true}
          tooltipProps={{
            content: <T id={'setting_your_auto_generated_estimate_number'} />,
            position: Position.BOTTOM_LEFT,
          }}
        />
      </ControlGroup>
    </FFormGroup>
  );
});

EstimateFormEstimateNumberField.displayName = 'EstimateFormEstimateNumberField';
