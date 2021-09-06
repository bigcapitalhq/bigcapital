import React, { useMemo, useEffect } from 'react';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import { CLASSES } from 'common/classes';
import { FormattedMessage as T } from 'components';
import AppToaster from 'components/AppToaster';
import {
  CreateVendorFormSchema,
  EditVendorFormSchema,
} from './VendorForm.schema';

import VendorFormPrimarySection from './VendorFormPrimarySection';
import VendorFormAfterPrimarySection from './VendorFormAfterPrimarySection';
import VendorTabs from './VendorsTabs';
import VendorFloatingActions from './VendorFloatingActions';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';

import { useVendorFormContext } from './VendorFormProvider';
import { compose, transformToForm } from 'utils';

const defaultInitialValues = {
  salutation: '',
  first_name: '',
  last_name: '',
  company_name: '',
  display_name: '',

  email: '',
  work_phone: '',
  personal_phone: '',
  website: '',
  note: '',
  active: true,

  billing_address_country: '',
  billing_address_1: '',
  billing_address_2: '',
  billing_address_city: '',
  billing_address_state: '',
  billing_address_postcode: '',
  billing_address_phone: '',

  shipping_address_country: '',
  shipping_address_1: '',
  shipping_address_2: '',
  shipping_address_city: '',
  shipping_address_state: '',
  shipping_address_postcode: '',
  shipping_address_phone: '',

  opening_balance: '',
  currency_code: '',
  opening_balance_at: moment(new Date()).format('YYYY-MM-DD'),
};

/**
 * Vendor form.
 */
function VendorForm({
  // #withDashboardActions
  changePageTitle,

  // #withCurrentOrganization
  organization: { base_currency },
}) {
  // Vendor form context.
  const {
    vendorId,
    vendor,
    contactDuplicate,
    createVendorMutate,
    editVendorMutate,
    setSubmitPayload,
    submitPayload,
    isNewMode,
  } = useVendorFormContext();

  // const isNewMode = !vendorId;

  // History context.
  const history = useHistory();

  /**
   * Initial values in create and edit mode.
   */
  const initialValues = useMemo(
    () => ({
      ...defaultInitialValues,
      currency_code: base_currency,
      ...transformToForm(vendor, defaultInitialValues),
      ...transformToForm(contactDuplicate, defaultInitialValues),
    }),
    [vendor, contactDuplicate, base_currency],
  );

  // Handles the form submit.
  const handleFormSubmit = (
    values,
    { setSubmitting, resetForm, setErrors },
  ) => {
    const requestForm = { ...values };
    setSubmitting(true);

    const onSuccess = () => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_vendor_has_been_created_successfully'
            : 'the_item_vendor_has_been_edited_successfully',
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitPayload(false);
      setSubmitting(false);
      resetForm();

      if (!submitPayload.noRedirect) {
        history.push('/vendors');
      }
    };

    const onError = () => {
      setSubmitPayload(false);
      setSubmitting(false);
    };

    if (isNewMode) {
      createVendorMutate(requestForm).then(onSuccess).catch(onError);
    } else {
      editVendorMutate([vendor.id, requestForm]).then(onSuccess).catch(onError);
    }
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM, CLASSES.PAGE_FORM_VENDOR)}>
      <Formik
        validationSchema={
          isNewMode ? CreateVendorFormSchema : EditVendorFormSchema
        }
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <Form>
          <div className={classNames(CLASSES.PAGE_FORM_HEADER_PRIMARY)}>
            <VendorFormPrimarySection />
          </div>

          <div className={'page-form__after-priamry-section'}>
            <VendorFormAfterPrimarySection />
          </div>

          <div className={classNames(CLASSES.PAGE_FORM_TABS)}>
            <VendorTabs vendor={vendorId} />
          </div>

          <VendorFloatingActions />
        </Form>
      </Formik>
    </div>
  );
}

export default compose(
  withDashboardActions,
  withCurrentOrganization(),
)(VendorForm);
