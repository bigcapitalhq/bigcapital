import React, { useState, useMemo, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { Intent } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import { CLASSES } from 'common/classes';
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
import withVendorDetail from './withVendorDetail';
import withVendorActions from './withVendorActions';
import withSettings from 'containers/Settings/withSettings';

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

  // #withVendorDetailsActions
  vendor,
  // #withVendorActions
  requestSubmitVendor,
  requestEditVendor,

  // #withSettings
  baseCurrency,

  // #OwnProps
  vendorId,
}) {
  const isNewMode = !vendorId;
  const [submitPayload, setSubmitPayload] = useState({});

  const history = useHistory();
  const { formatMessage } = useIntl();

  /**
   * Initial values in create and edit mode.
   */
  const initialValues = useMemo(
    () => ({
      ...defaultInitialValues,
      currency_code: baseCurrency,
      ...transformToForm(vendor, defaultInitialValues),
    }),
    [defaultInitialValues],
  );
  useEffect(() => {
    !isNewMode
      ? changePageTitle(formatMessage({ id: 'edit_vendor' }))
      : changePageTitle(formatMessage({ id: 'new_vendor' }));
  }, [changePageTitle, isNewMode, formatMessage]);

  //Handles the form submit.
  const handleFormSubmit = (
    values,
    { setSubmitting: resetForm, setErrors },
  ) => {
    const requestForm = { ...values };

    const onSuccess = () => {
      AppToaster.show({
        message: formatMessage({
          id: isNewMode
            ? 'the_vendor_has_been_successfully_created'
            : 'the_item_vendor_has_been_successfully_edited',
        }),
        intent: Intent.SUCCESS,
      });
      setSubmitPayload(false);
      resetForm();

      if (!submitPayload.noRedirect) {
        history.push('/vendors');
      }
    };

    const onError = () => {
      setSubmitPayload(false);
    };

    if (vendor && vendor.id) {
      requestEditVendor(vendor.id, requestForm).then(onSuccess).catch(onError);
    } else {
      requestSubmitVendor(requestForm).then(onSuccess).catch(onError);
    }
  };

  const handleCancelClick = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleSubmitClick = useCallback(
    (event, payload) => {
      setSubmitPayload({ ...payload });
    },
    [setSubmitPayload],
  );

  return (
    <div className={classNames(CLASSES.PAGE_FORM, CLASSES.PAGE_FORM_CUSTOMER)}>
      <Formik
        validationSchema={
          isNewMode ? CreateVendorFormSchema : EditVendorFormSchema
        }
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting }) => (
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

            <VendorFloatingActions
              isSubmitting={isSubmitting}
              vendor={vendorId}
              onSubmitClick={handleSubmitClick}
              onCancelClick={handleCancelClick}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default compose(
  withVendorDetail(),
  withDashboardActions,
  withSettings(({ organizationSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
  })),
  withVendorActions,
)(VendorForm);
