import { Intent } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { Formik, Form, FormikHelpers } from 'formik';
import { sumBy, isEmpty, defaultTo } from 'lodash';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import {
  EstimateIncrementSyncSettingsToForm,
  EstimateSyncAutoExRateToForm,
} from './components';
import { EstimateFloatingActions } from './EstimateFloatingActions';
import {
  CreateEstimateFormSchema,
  EditEstimateFormSchema,
} from './EstimateForm.schema';
import { EstimateFormDialogs } from './EstimateFormDialogs';
import { EstiamteFormFooter as EstimateFormFooter } from './EstimateFormFooter';
import { EstimateFormHeader } from './EstimateFormHeader';
import { useEstimateFormContext } from './EstimateFormProvider';
import { EstimateFormItemsEntriesField as EstimateItemsEntriesField } from './EstimateItemsEntriesField';
import { EstimtaeFormTopBar } from './EstimtaeFormTopBar';
import {
  transformToEditForm,
  defaultEstimate,
  transformValueToRequest,
  handleErrors,
  resetFormState,
} from './utils';
import type { EstimateFormValues } from './utils';
import { AppToaster } from '@/components';
import { PageForm } from '@/components/PageForm';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { compose, transactionNumber, orderingLinesIndexes } from '@/utils';

type EstimateFormRootProps = Record<string, never>;

/**
 * Estimate form.
 */
function EstimateFormInner({}: EstimateFormRootProps) {
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const history = useHistory();
  const {
    estimate,
    isNewMode,
    submitPayload,
    createEstimateMutate,
    editEstimateMutate,
    saleEstimateState,
    estimatesSettings,
  } = useEstimateFormContext();

  const estimateNextNumber = estimatesSettings?.nextNumber as
    | number
    | undefined;
  const estimateNumberPrefix = estimatesSettings?.numberPrefix as
    | string
    | undefined;
  const estimateAutoIncrementMode = estimatesSettings?.autoIncrement as
    | boolean
    | undefined;
  const estimateCustomerNotes = estimatesSettings?.customerNotes as
    | string
    | undefined;
  const estimateTermsConditions = estimatesSettings?.termsConditions as
    | string
    | undefined;

  const estimateNumber = transactionNumber(
    estimateNumberPrefix,
    estimateNextNumber,
  );
  // Form initial values.
  const isEditMode = !isEmpty(estimate) && !!estimate;
  // Initial values in create and edit mode.
  const initialValues: EstimateFormValues = isEditMode
    ? transformToEditForm(estimate)
    : {
        ...defaultEstimate,
        // If the auto-increment mode is enabled, take the next estimate
        // number from the settings.
        ...(estimateAutoIncrementMode && {
          estimateNumber,
        }),
        entries: orderingLinesIndexes(defaultEstimate.entries),
        currencyCode: baseCurrency ?? '',
        termsConditions: defaultTo(estimateTermsConditions, ''),
        note: defaultTo(estimateCustomerNotes, ''),
        pdfTemplateId: saleEstimateState?.defaultTemplateId ?? '',
      };

  // Handles form submit.
  const handleFormSubmit = (
    values: EstimateFormValues,
    { setSubmitting, setErrors, resetForm }: FormikHelpers<EstimateFormValues>,
  ) => {
    setSubmitting(true);

    const entries = values.entries.filter(
      (item) => item.itemId && item.quantity,
    );
    const totalQuantity = sumBy(entries, (entry) =>
      parseInt(String(entry.quantity), 10),
    );

    // Validate the entries quantity should be bigger than zero.
    if (totalQuantity === 0) {
      AppToaster.show({
        message: intl.get('quantity_cannot_be_zero_or_empty'),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }
    const form = {
      ...transformValueToRequest(values),
      delivered: submitPayload.deliver,
    };
    // Handle the request success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_estimate_has_been_created_successfully'
            : 'the_estimate_has_been_edited_successfully',
          { number: values.estimateNumber },
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      if (submitPayload.redirect) {
        history.push('/estimates');
      }
      if (submitPayload.resetForm) {
        resetFormState({ resetForm, initialValues, values });
      }
    };
    // Handle the request error.
    const onError = ({
      data: { errors },
    }: {
      data: { errors: Array<{ type: string }> };
    }) => {
      if (errors) {
        handleErrors(errors, { setErrors });
      }
      setSubmitting(false);
    };
    if (!isNewMode && estimate) {
      editEstimateMutate([estimate.id, form]).then(onSuccess).catch(onError);
    } else {
      createEstimateMutate(form).then(onSuccess).catch(onError);
    }
  };

  return (
    <Formik
      validationSchema={
        isNewMode ? CreateEstimateFormSchema : EditEstimateFormSchema
      }
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
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
            <EstimtaeFormTopBar />
            <EstimateFormHeader />
            <EstimateItemsEntriesField />
            <EstimateFormFooter />
          </PageForm.Body>

          <PageForm.Footer>
            <EstimateFloatingActions />
          </PageForm.Footer>
        </PageForm>

        {/*------- Dialogs -------*/}
        <EstimateFormDialogs />

        {/*------- Effects -------*/}
        <EstimateIncrementSyncSettingsToForm />
        <EstimateSyncAutoExRateToForm />
      </Form>
    </Formik>
  );
}

export const EstimateForm = EstimateFormInner;
