import {
  Button,
  Callout,
  FormGroup,
  HTMLSelect,
  Tab,
  Tabs,
} from '@blueprintjs/core';
import { Form, Formik } from 'formik';
import moment from 'moment';
import intl from 'react-intl-universal';
import { FinancialStatementDateRange } from '../FinancialStatementDateRange';
import { FinancialStatementHeader } from '../FinancialStatementHeader';
import type { ReconciliationStatusTableResponse } from '@bigcapital/sdk-ts';
import { Col, FormattedMessage as T, Row } from '@/components';

export interface ReconciliationStatusFilterValues {
  accountId: string;
  fromDate: string;
  toDate: string;
}

interface FilterFormValues {
  accountId: string;
  fromDate: string | Date;
  toDate: string | Date;
}

interface ReconciliationStatusFiltersProps {
  filters: ReconciliationStatusFilterValues;
  bankAccounts: ReconciliationStatusTableResponse['bankAccounts'];
  isOpen: boolean;
  onApply: (filters: ReconciliationStatusFilterValues) => void;
  onClose: () => void;
}

const formatDate = (date: string | Date) =>
  date ? moment(date).locale('en').format('YYYY-MM-DD') : '';

export function ReconciliationStatusFilters({
  filters,
  bankAccounts,
  isOpen,
  onApply,
  onClose,
}: ReconciliationStatusFiltersProps) {
  return (
    <FinancialStatementHeader isOpen={isOpen} drawerProps={{ onClose }}>
      <Formik<FilterFormValues>
        initialValues={filters}
        enableReinitialize
        validateOnMount
        validate={({ fromDate, toDate }) => {
          if (fromDate && toDate && formatDate(fromDate) > formatDate(toDate)) {
            return {
              toDate: intl.get('report.reconciliation_status.invalid_range'),
            };
          }
          return {};
        }}
        onSubmit={({ accountId, fromDate, toDate }, { setSubmitting }) => {
          onApply({
            accountId,
            fromDate: formatDate(fromDate),
            toDate: formatDate(toDate),
          });
          setSubmitting(false);
        }}
      >
        {({ values, errors, handleChange, isValid, resetForm }) => {
          const close = () => {
            resetForm();
            onClose();
          };

          return (
            <Form>
              <Tabs vertical>
                <Tab
                  id="general"
                  title={<T id="general" />}
                  panel={
                    <>
                      <FinancialStatementDateRange
                        allDatesLabel={intl.get(
                          'report.reconciliation_status.all_dates',
                        )}
                      />
                      <Row>
                        <Col xs={4}>
                          <FormGroup
                            label={intl.get('account')}
                            labelFor="reconciliation-account"
                          >
                            <HTMLSelect
                              id="reconciliation-account"
                              name="accountId"
                              value={values.accountId}
                              onChange={handleChange}
                              fill
                            >
                              <option value="">
                                {intl.get(
                                  'report.reconciliation_status.all_bank_accounts',
                                )}
                              </option>
                              {values.accountId &&
                                !bankAccounts.some(
                                  ({ id }) => String(id) === values.accountId,
                                ) && (
                                  <option value={values.accountId}>
                                    {values.accountId}
                                  </option>
                                )}
                              {bankAccounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                  {account.name}
                                </option>
                              ))}
                            </HTMLSelect>
                          </FormGroup>
                        </Col>
                      </Row>
                      {errors.toDate && (
                        <Callout intent="danger" role="alert">
                          {errors.toDate}
                        </Callout>
                      )}
                    </>
                  }
                />
              </Tabs>
              <div className="financial-header-drawer__footer">
                <Button
                  className="mr1"
                  intent="primary"
                  type="submit"
                  disabled={!isValid}
                >
                  <T id="calculate_report" />
                </Button>
                <Button minimal type="button" onClick={close}>
                  <T id="cancel" />
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </FinancialStatementHeader>
  );
}
