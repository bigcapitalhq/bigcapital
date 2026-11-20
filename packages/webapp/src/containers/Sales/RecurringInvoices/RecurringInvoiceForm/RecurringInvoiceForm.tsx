import { Intent } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { Form, Formik } from 'formik';
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { RecurringInvoiceFloatingActions } from './RecurringInvoiceFloatingActions';
import { RecurringInvoiceFormFooter } from './RecurringInvoiceFormFooter';
import { RecurringInvoiceFormHeader } from './RecurringInvoiceFormHeader';
import { useRecurringInvoiceFormContext } from './RecurringInvoiceFormProvider';
import { RecurringInvoiceItemsField } from './RecurringInvoiceItemsField';
import {
  defaultRecurringInvoice,
  transformRecurringInvoiceToForm,
  transformRecurringInvoiceToRequest,
} from './utils';
import type { RecurringInvoiceFormValues } from './utils';
import { AppToaster, PageForm } from '@/components';
import { isItemOrDescriptionEntry } from '@/containers/Entries/utils';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { isBlank } from '@/utils';

const validationSchema = Yup.object().shape({
  customerId: Yup.mixed().required(intl.get('customer_is_required')),
  profileName: Yup.string().required(intl.get('field_is_required')),
  startDate: Yup.string().required(intl.get('field_is_required')),
  frequency: Yup.string().required(intl.get('field_is_required')),
  repeatInterval: Yup.number().min(1).required(),
  entries: Yup.array()
    .of(
      Yup.object().shape({
        itemId: Yup.mixed().nullable(),
        sellAccountId: Yup.mixed()
          .nullable()
          .test(
            'account-required-without-item',
            intl.get('item_entries.account_required_without_item'),
            function (value) {
              const { itemId, quantity, rate } = this.parent;
              if (isBlank(itemId) && !isBlank(quantity) && !isBlank(rate)) {
                return !isBlank(value);
              }
              return true;
            },
          ),
        description: Yup.string()
          .nullable()
          .test(
            'item-or-description-required',
            intl.get('item_entries.item_or_description_required'),
            function (value) {
              const { itemId, quantity, rate } = this.parent;
              if (isBlank(itemId) && !isBlank(quantity) && !isBlank(rate)) {
                return typeof value === 'string' && value.trim().length > 0;
              }
              return true;
            },
          ),
      }),
    )
    .test(
      'at-least-one-entry',
      intl.get('recurring_invoice.form.entries_required'),
      (entries) =>
        (entries ?? []).some(
          (entry: any) =>
            isItemOrDescriptionEntry(entry) && Number(entry.quantity) > 0,
        ),
    ),
});

export function RecurringInvoiceForm() {
  const history = useHistory();
  const baseCurrency = useCurrentOrganizationBaseCurrency();
  const {
    recurringInvoice,
    isNewMode,
    createRecurringInvoice,
    editRecurringInvoice,
  } = useRecurringInvoiceFormContext();

  const initialValues = useMemo<RecurringInvoiceFormValues>(() => {
    return recurringInvoice
      ? transformRecurringInvoiceToForm(recurringInvoice)
      : { ...defaultRecurringInvoice, currencyCode: baseCurrency ?? '' };
  }, [recurringInvoice, baseCurrency]);

  const handleSubmit = async (values: RecurringInvoiceFormValues) => {
    const payload = transformRecurringInvoiceToRequest(values);

    try {
      if (isNewMode) {
        await createRecurringInvoice(payload);
        AppToaster.show({
          message: intl.get('recurring_invoice.created_successfully'),
          intent: Intent.SUCCESS,
        });
      } else {
        await editRecurringInvoice([recurringInvoice!.id, payload as any]);
        AppToaster.show({
          message: intl.get('recurring_invoice.updated_successfully'),
          intent: Intent.SUCCESS,
        });
      }
      history.push('/recurring-invoices');
    } catch (error: any) {
      const message =
        error?.data?.errors?.[0]?.message || intl.get('something_went_wrong');
      AppToaster.show({ message, intent: Intent.DANGER });
    }
  };

  return (
    <Formik<RecurringInvoiceFormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      <Form
        className={css({
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        })}
      >
        <PageForm flex={1}>
          <PageForm.Body>
            <RecurringInvoiceFormHeader />

            <RecurringInvoiceItemsField />
            <RecurringInvoiceFormFooter />
          </PageForm.Body>
          <PageForm.Footer>
            <RecurringInvoiceFloatingActions />
          </PageForm.Footer>
        </PageForm>
      </Form>
    </Formik>
  );
}
