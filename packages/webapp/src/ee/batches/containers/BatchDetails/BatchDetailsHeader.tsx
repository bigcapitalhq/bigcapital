import { Button, Intent, Tab, Tabs } from '@blueprintjs/core';
import { Form, Formik } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { getDefaultBatchDetailsQuery } from './utils';
import type { BatchDetailsReportQuery } from '@/ee/batches/hooks/query';
import {
  Col,
  FFormGroup,
  FHTMLSelect,
  FInputGroup,
  FItemsMultiSelect,
  FormattedMessage as T,
  Row,
} from '@/components';
import { FinancialStatementHeader } from '@/containers/FinancialStatements/FinancialStatementHeader';
import { useItems } from '@/hooks/query';
import { transformToForm } from '@/utils';

interface BatchDetailsFormValues {
  itemsIds: number[];
  status: string;
  search: string;
}

interface BatchDetailsHeaderProps {
  isOpen: boolean;
  pageFilter: BatchDetailsReportQuery;
  onSubmitFilter: (values: BatchDetailsFormValues) => void;
  onClose: () => void;
}

const STATUS_OPTIONS = [
  { value: '', label: intl.get('batch.status.all') },
  { value: 'active', label: intl.get('batch.status.active') },
  { value: 'expiring_soon', label: intl.get('batch.status.expiring_soon') },
  { value: 'expired', label: intl.get('batch.status.expired') },
  { value: 'depleted', label: intl.get('batch.status.depleted') },
];

/**
 * Batch details report - General filter panel.
 */
function BatchDetailsGeneralPanel() {
  const { data: itemsData } = useItems({
    stringified_filter_roles: JSON.stringify([
      { fieldKey: 'type', comparator: 'is', value: 'inventory', index: 1 },
    ]),
    page_size: 10000,
  });
  const items = (itemsData as { data?: unknown[] })?.data ?? [];

  return (
    <>
      <Row>
        <Col xs={4}>
          <FFormGroup label={intl.get('items')} name={'itemsIds'} fastField>
            <FItemsMultiSelect name={'itemsIds'} items={items as never} />
          </FFormGroup>
        </Col>
      </Row>

      <Row>
        <Col xs={4}>
          <FFormGroup label={intl.get('batch.column.status')} name={'status'}>
            <FHTMLSelect name={'status'} fill={true} options={STATUS_OPTIONS} />
          </FFormGroup>
        </Col>
      </Row>

      <Row>
        <Col xs={4}>
          <FFormGroup label={intl.get('search')} name={'search'} fastField>
            <FInputGroup name={'search'} fill={true} />
          </FFormGroup>
        </Col>
      </Row>
    </>
  );
}

/**
 * Batch details report - filter drawer header.
 */
export function BatchDetailsHeader({
  isOpen,
  pageFilter,
  onSubmitFilter,
  onClose,
}: BatchDetailsHeaderProps) {
  const defaultQuery = getDefaultBatchDetailsQuery();
  const initialValues = transformToForm(
    { ...defaultQuery, ...pageFilter },
    defaultQuery,
  ) as BatchDetailsFormValues;

  return (
    <BatchDetailsDrawerHeader isOpen={isOpen} drawerProps={{ onClose }}>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting }) => {
          onSubmitFilter(values);
          onClose();
          setSubmitting(false);
        }}
      >
        <Form>
          <Tabs animate={true} vertical={true} renderActiveTabPanelOnly={true}>
            <Tab
              id={'general'}
              title={<T id={'general'} />}
              panel={<BatchDetailsGeneralPanel />}
            />
          </Tabs>

          <div className="financial-header-drawer__footer">
            <Button className={'mr1'} intent={Intent.PRIMARY} type={'submit'}>
              <T id={'calculate_report'} />
            </Button>
            <Button onClick={onClose} minimal={true}>
              <T id={'cancel'} />
            </Button>
          </div>
        </Form>
      </Formik>
    </BatchDetailsDrawerHeader>
  );
}

const BatchDetailsDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 450px;
  }
`;
