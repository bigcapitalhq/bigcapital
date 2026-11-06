import { Intent } from '@blueprintjs/core';
import { Form, Formik } from 'formik';
import { round, sumBy } from 'lodash';
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { RecurringJournalEntriesField } from './RecurringJournalEntriesField';
import { RecurringJournalFloatingActions } from './RecurringJournalFloatingActions';
import { RecurringJournalFormFields } from './RecurringJournalFormFields';
import { RecurringJournalFormFooter } from './RecurringJournalFormFooter';
import { useRecurringJournalFormContext } from './RecurringJournalFormProvider';
import {
  defaultRecurringJournal,
  transformRecurringJournalToForm,
  transformRecurringJournalToRequest,
} from './utils';
import type { RecurringJournalFormValues } from './utils';
import { AppToaster, PageForm } from '@/components';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';

const validationSchema = Yup.object().shape({
  profileName: Yup.string().required(intl.get('field_is_required')),
  startDate: Yup.string().required(intl.get('field_is_required')),
  frequency: Yup.string().required(intl.get('field_is_required')),
  repeatInterval: Yup.number().min(1).required(),
  entries: Yup.array()
    .test(
      'at-least-one-entry',
      intl.get('recurring_journal.form.entries_required'),
      (entries) =>
        (entries ?? []).some(
          (entry: any) =>
            entry.accountId &&
            (Number(entry.debit) > 0 || Number(entry.credit) > 0),
        ),
    )
    .test('accounts-required', intl.get('field_is_required'), (entries) =>
      (entries ?? []).every(
        (entry: any) => (!entry.debit && !entry.credit) || !!entry.accountId,
      ),
    )
    .test(
      'balanced-entries',
      intl.get('should_total_of_credit_and_debit_be_equal'),
      (entries) => {
        const totalDebit = round(
          sumBy(entries ?? [], (entry: any) => Number(entry.debit) || 0),
          2,
        );
        const totalCredit = round(
          sumBy(entries ?? [], (entry: any) => Number(entry.credit) || 0),
          2,
        );
        return totalDebit === totalCredit;
      },
    ),
});

export function RecurringJournalForm() {
  const history = useHistory();
  const baseCurrency = useCurrentOrganizationBaseCurrency();
  const {
    recurringJournal,
    branches,
    isNewMode,
    createRecurringJournal,
    editRecurringJournal,
  } = useRecurringJournalFormContext();

  const initialValues = useMemo<RecurringJournalFormValues>(() => {
    if (recurringJournal) {
      return transformRecurringJournalToForm(recurringJournal);
    }
    const primaryBranch = branches.find((branch: any) => branch.primary);
    return {
      ...defaultRecurringJournal,
      currencyCode: baseCurrency ?? '',
      ...(primaryBranch ? { branchId: primaryBranch.id } : {}),
    };
  }, [recurringJournal, baseCurrency, branches]);

  const handleSubmit = async (values: RecurringJournalFormValues) => {
    const payload = transformRecurringJournalToRequest(values);

    try {
      if (isNewMode) {
        await createRecurringJournal(payload);
        AppToaster.show({
          message: intl.get('recurring_journal.created_successfully'),
          intent: Intent.SUCCESS,
        });
      } else {
        await editRecurringJournal([recurringJournal!.id, payload as any]);
        AppToaster.show({
          message: intl.get('recurring_journal.updated_successfully'),
          intent: Intent.SUCCESS,
        });
      }
      history.push('/recurring-journals');
    } catch (error: any) {
      const message =
        error?.data?.errors?.[0]?.message || intl.get('something_went_wrong');
      AppToaster.show({ message, intent: Intent.DANGER });
    }
  };

  return (
    <Formik<RecurringJournalFormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      <Form>
        <PageForm flex={1}>
          <PageForm.Body>
            <div style={{ padding: '24px 32px 0' }}>
              <RecurringJournalFormFields />
            </div>
            <RecurringJournalEntriesField />
            <RecurringJournalFormFooter />
          </PageForm.Body>
          <PageForm.Footer>
            <RecurringJournalFloatingActions />
          </PageForm.Footer>
        </PageForm>
      </Form>
    </Formik>
  );
}
