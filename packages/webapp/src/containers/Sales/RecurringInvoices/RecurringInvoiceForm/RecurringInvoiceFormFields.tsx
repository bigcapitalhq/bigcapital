import { Position } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useRecurringInvoiceFormContext } from './RecurringInvoiceFormProvider';
import type { RecurringInvoiceFormValues } from './utils';
import {
  CustomersSelect,
  FDateInput,
  FFormGroup,
  FInputGroup,
  FSelect,
  FieldRequiredHint,
  Icon,
  Stack,
} from '@/components';
import { useDateInputFormatter } from '@/hooks';

const FREQUENCY_OPTIONS = [
  { key: 'day', label: intl.get('recurring_invoice.frequency.day') },
  { key: 'week', label: intl.get('recurring_invoice.frequency.week') },
  { key: 'month', label: intl.get('recurring_invoice.frequency.month') },
  { key: 'year', label: intl.get('recurring_invoice.frequency.year') },
];

const DELIVERY_OPTIONS = [
  { key: 'draft', label: intl.get('recurring_invoice.delivery.draft') },
  { key: 'email', label: intl.get('recurring_invoice.delivery.email') },
];

export function RecurringInvoiceFormFields() {
  const dateInputFormatter = useDateInputFormatter();
  const { values } = useFormikContext<RecurringInvoiceFormValues>();

  return (
    <Stack spacing={18} flex={1}>
      <RecurringInvoiceCustomerSelect />

      <FFormGroup
        name={'exchangeRate'}
        label={intl.get('exchange_rate')}
        inline
        fastField
      >
        <FInputGroup
          name={'exchangeRate'}
          type="number"
          min={0}
          step="0.000001"
        />
      </FFormGroup>

      <FFormGroup
        name={'profileName'}
        label={intl.get('recurring_invoice.field.profile_name')}
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <FInputGroup
          name={'profileName'}
          data-testId="recurring-invoice-profile-name"
        />
      </FFormGroup>

      <FFormGroup
        name={'referenceNo'}
        label={intl.get('reference')}
        inline
        fastField
      >
        <FInputGroup name={'referenceNo'} />
      </FFormGroup>

      <FFormGroup
        name={'startDate'}
        label={intl.get('recurring_invoice.field.start_date')}
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <FDateInput
          name={'startDate'}
          {...dateInputFormatter}
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

      <FFormGroup
        name={'endDate'}
        label={intl.get('recurring_invoice.field.end_date')}
        inline
        fastField
      >
        <FDateInput
          name={'endDate'}
          {...dateInputFormatter}
          canClearSelection={true}
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

      <FFormGroup
        name={'repeatInterval'}
        label={intl.get('recurring_invoice.field.repeat_every')}
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          <FInputGroup
            name={'repeatInterval'}
            type="number"
            min={1}
            style={{ maxWidth: 90 }}
          />
          <FSelect
            name={'frequency'}
            items={FREQUENCY_OPTIONS}
            valueAccessor={'key'}
            textAccessor={'label'}
            popoverProps={{ minimal: true }}
          />
        </div>
      </FFormGroup>

      <FFormGroup
        name={'maxOccurrences'}
        label={intl.get('recurring_invoice.field.max_occurrences')}
        inline
        fastField
      >
        <FInputGroup
          name={'maxOccurrences'}
          type="number"
          min={1}
          placeholder={intl.get('recurring_invoice.field.unlimited')}
        />
      </FFormGroup>

      <FFormGroup
        name={'dueDays'}
        label={intl.get('recurring_invoice.field.due_days')}
        inline
        fastField
      >
        <FInputGroup name={'dueDays'} type="number" min={0} />
      </FFormGroup>

      <FFormGroup
        name={'deliveryMode'}
        label={intl.get('recurring_invoice.field.delivery_mode')}
        inline
        fastField
      >
        <FSelect
          name={'deliveryMode'}
          items={DELIVERY_OPTIONS}
          valueAccessor={'key'}
          textAccessor={'label'}
          popoverProps={{ minimal: true }}
        />
      </FFormGroup>

      {values.deliveryMode === 'email' && (
        <>
          <FFormGroup
            name={'emailSubject'}
            label={intl.get('recurring_invoice.field.email_subject')}
            inline
            fastField
          >
            <FInputGroup
              name={'emailSubject'}
              placeholder={intl.get(
                'recurring_invoice.field.email_subject_placeholder',
              )}
            />
          </FFormGroup>

          <FFormGroup
            name={'emailCc'}
            label={intl.get('recurring_invoice.field.email_cc')}
            inline
            fastField
          >
            <FInputGroup name={'emailCc'} />
          </FFormGroup>

          <FFormGroup
            name={'emailBcc'}
            label={intl.get('recurring_invoice.field.email_bcc')}
            inline
            fastField
          >
            <FInputGroup name={'emailBcc'} />
          </FFormGroup>
        </>
      )}
    </Stack>
  );
}

function RecurringInvoiceCustomerSelect() {
  const { values, setFieldValue } =
    useFormikContext<RecurringInvoiceFormValues>();
  const { customers } = useRecurringInvoiceFormContext();

  const handleItemChange = (customer: { id: number; currencyCode: string }) => {
    if (values.customerId !== customer.id) {
      setFieldValue('customerId', customer.id);
      setFieldValue('currencyCode', customer.currencyCode);
    }
  };

  return (
    <FFormGroup
      name={'customerId'}
      label={intl.get('customer_name')}
      labelInfo={<FieldRequiredHint />}
      inline
      fastField
    >
      <CustomersSelect
        name={'customerId'}
        items={customers}
        placeholder={intl.get('select_customer_account')}
        onItemChange={handleItemChange}
        allowCreate={true}
        fastField={true}
      />
    </FFormGroup>
  );
}
