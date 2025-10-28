// @ts-nocheck
import React from 'react';
import { Position } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import classNames from 'classnames';
import { useTheme } from '@emotion/react';
import { css } from '@emotion/css';

import { CLASSES } from '@/constants/classes';
import {} from '@/utils';
import {
  Hint,
  FieldRequiredHint,
  Icon,
  FSelect,
  FormattedMessage as T,
  FFormGroup,
  FInputGroup,
  FDateInput,
  Stack,
} from '@/components';
import { useMakeJournalFormContext } from './MakeJournalProvider';
import { JournalExchangeRateInputField } from './components';
import { MakeJournalTransactionNoField } from './MakeJournalTransactionNoField';

const getFieldsStyle = (theme: Theme) => css`
  .${theme.bpPrefix}-form-group {
    margin-bottom: 0;

    &.${theme.bpPrefix}-inline {
      max-width: 450px;
    }
    .${theme.bpPrefix}-label {
      min-width: 150px;
      font-weight: 500;
    }
    .${theme.bpPrefix}-form-content {
      width: 100%;
    }
  }
`;

/**
 * Make journal entries header.
 */
export default function MakeJournalEntriesHeader({}) {
  const { currencies } = useMakeJournalFormContext();
  const form = useFormikContext();
  const theme = useTheme();
  const fieldsClassName = getFieldsStyle(theme);

  return (
    <Stack spacing={18} flex={1} className={fieldsClassName}>
      {/*------------ Posting date -----------*/}
      <FFormGroup
        name={'date'}
        label={<T id={'posting_date'} />}
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <FDateInput
          name={'date'}
          formatDate={(date) => date.toLocaleDateString()}
          parseDate={(str) => new Date(str)}
          popoverProps={{
            position: Position.BOTTOM_LEFT,
            minimal: true,
            fill: true,
          }}
          inputProps={{
            leftIcon: <Icon icon={'date-range'} />,
          }}
          fill
          fastField
        />
      </FFormGroup>

      {/*------------ Journal number -----------*/}
      <MakeJournalTransactionNoField />

      {/*------------ Reference -----------*/}
      <FFormGroup
        name={'reference'}
        label={<T id={'reference'} />}
        labelInfo={
          <Hint
            content={<T id={'journal_reference_hint'} />}
            position={Position.RIGHT}
          />
        }
        inline
        fastField
      >
        <FInputGroup name={'reference'} minimal fill />
      </FFormGroup>

      {/*------------ Journal type  -----------*/}
      <FFormGroup
        name={'journal_type'}
        label={<T id={'journal_type'} />}
        inline
        fastField
      >
        <FInputGroup name={'journal_type'} minimal fill />
      </FFormGroup>

      {/*------------ Currency  -----------*/}
      <FFormGroup
        name={'currency_code'}
        label={<T id={'currency'} />}
        inline
        fastField
      >
        <FSelect
          name={'currency_code'}
          items={currencies}
          onItemChange={(currencyItem) => {
            form.setFieldValue('currency_code', currencyItem.currency_code);
            form.setFieldValue('exchange_rate', '');
          }}
          popoverProps={{
            inline: true,
            minimal: true,
            captureDismiss: true,
          }}
          valueAccessor={'currency_code'}
          labelAccessor={'currency_name'}
          textAccessor={'currency_code'}
          fastField
        />
      </FFormGroup>

      {/* ----------- Exchange rate ----------- */}
      <JournalExchangeRateInputField
        name={'exchange_rate'}
        formGroupProps={{ label: ' ', inline: true }}
      />
    </Stack>
  );
}
