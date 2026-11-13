import { Button, Intent } from '@blueprintjs/core';
import { Form, Formik } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import type { BatchDetailsReportQuery } from '@/hooks/query';
import {
  Card,
  FFormGroup,
  FInputGroup,
  FItemsMultiSelect,
  FHTMLSelect,
  FormattedMessage as T,
} from '@/components';
import { useItems } from '@/hooks/query';

interface BatchDetailsFilterFormValues {
  itemsIds: number[];
  status: string;
  search: string;
}

interface BatchDetailsFiltersProps {
  initialValues: BatchDetailsReportQuery;
  onSubmit: (values: BatchDetailsFilterFormValues) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: intl.get('batch.status.all') },
  { value: 'active', label: intl.get('batch.status.active') },
  { value: 'expiring_soon', label: intl.get('batch.status.expiring_soon') },
  { value: 'expired', label: intl.get('batch.status.expired') },
  { value: 'depleted', label: intl.get('batch.status.depleted') },
];

/**
 * Batch details report filters.
 */
export function BatchDetailsFilters({
  initialValues,
  onSubmit,
}: BatchDetailsFiltersProps) {
  const { data: itemsData } = useItems({
    stringified_filter_roles: JSON.stringify([
      { fieldKey: 'type', comparator: 'is', value: 'inventory', index: 1 },
    ]),
    page_size: 10000,
  });
  const items = (itemsData as { data?: unknown[] })?.data ?? [];

  const formInitialValues: BatchDetailsFilterFormValues = {
    itemsIds: initialValues.itemsIds ?? [],
    status: initialValues.status ?? '',
    search: initialValues.search ?? '',
  };

  return (
    <Card>
      <Formik
        initialValues={formInitialValues}
        enableReinitialize={true}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        <Form>
          <div className={'batch-details-filters'}>
            <FFormGroup name={'itemsIds'} label={intl.get('items')} inline>
              <FItemsMultiSelect name={'itemsIds'} items={items as never} />
            </FFormGroup>
            <FFormGroup
              name={'status'}
              label={intl.get('batch.column.status')}
              inline
            >
              <FHTMLSelect
                name={'status'}
                fill={true}
                options={STATUS_OPTIONS}
              />
            </FFormGroup>
            <FFormGroup name={'search'} label={intl.get('search')} inline>
              <FInputGroup name={'search'} fill={true} />
            </FFormGroup>
            <div className={'batch-details-filters__actions'}>
              <Button intent={Intent.PRIMARY} type={'submit'}>
                <T id={'calculate_report'} />
              </Button>
            </div>
          </div>
        </Form>
      </Formik>
    </Card>
  );
}
