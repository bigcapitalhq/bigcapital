import React, { useMemo } from 'react';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { defaultTo } from 'lodash';

import 'style/pages/Items/PageForm.scss';

import { CLASSES } from 'common/classes';
import AppToaster from 'components/AppToaster';
import ItemFormPrimarySection from './ItemFormPrimarySection';
import ItemFormBody from './ItemFormBody';
import ItemFormFloatingActions from './ItemFormFloatingActions';
import ItemFormInventorySection from './ItemFormInventorySection';

import withSettings from 'containers/Settings/withSettings';

import { compose, transformToForm } from 'utils';
import {
  EditItemFormSchema,
  CreateItemFormSchema,
  transformItemFormData,
} from './ItemForm.schema';

import { useItemFormContext } from './ItemFormProvider';

const defaultInitialValues = {
  active: 1,
  name: '',
  type: 'service',
  code: '',
  cost_price: '',
  sell_price: '',
  cost_account_id: '',
  sell_account_id: '',
  inventory_account_id: '',
  category_id: '',
  sellable: 1,
  purchasable: true,
  sell_description: '',
  purchase_description: '',
};

/**
 * Item form.
 */
function ItemForm({
  // #withSettings
  preferredCostAccount,
  preferredSellAccount,
  preferredInventoryAccount,
}) {
  // Item form context.
  const {
    itemId,
    item,
    accounts,
    createItemMutate,
    editItemMutate,
    submitPayload,
    isNewMode,
  } = useItemFormContext();

  // History context.
  const history = useHistory();

  const { formatMessage } = useIntl();

  /**
   * Initial values in create and edit mode.
   */
  const initialValues = useMemo(
    () => ({
      ...defaultInitialValues,
      cost_account_id: defaultTo(preferredCostAccount, ''),
      sell_account_id: defaultTo(preferredSellAccount, ''),
      inventory_account_id: defaultTo(preferredInventoryAccount, ''),
      /**
       * We only care about the fields in the form. Previously unfilled optional
       * values such as `notes` come back from the API as null, so remove those
       * as well.
       */
      ...transformToForm(
        transformItemFormData(item, defaultInitialValues),
        defaultInitialValues,
      ),
    }),
    [
      item,
      preferredCostAccount,
      preferredSellAccount,
      preferredInventoryAccount,
    ],
  );

  // Transform API errors.
  const transformApiErrors = (error) => {
    const {
      response: {
        data: { errors },
      },
    } = error;
    const fields = {};

    if (errors.find((e) => e.type === 'ITEM.NAME.ALREADY.EXISTS')) {
      fields.name = formatMessage({ id: 'the_name_used_before' });
    }
    if (errors.find((e) => e.type === 'INVENTORY_ACCOUNT_CANNOT_MODIFIED')) {
      AppToaster.show({
        message: formatMessage({
          id: 'cannot_change_item_inventory_account',
        }),
        intent: Intent.DANGER,
      });
    }
    return fields;
  };

  // Handles the form submit.
  const handleFormSubmit = (
    values,
    { setSubmitting, resetForm, setErrors },
  ) => {
    setSubmitting(true);
    const form = { ...values };

    const onSuccess = (response) => {
      AppToaster.show({
        message: formatMessage(
          {
            id: isNewMode
              ? 'the_item_has_been_created_successfully'
              : 'the_item_has_been_edited_successfully',
          },
          {
            number: itemId,
          },
        ),
        intent: Intent.SUCCESS,
      });
      resetForm();
      setSubmitting(false);

      // Submit payload.
      if (submitPayload.redirect) {
        history.push('/items');
      }
    };

    // Handle response error.
    const onError = (errors) => {
      setSubmitting(false);
      if (errors) {
        const _errors = transformApiErrors(errors);
        setErrors({ ..._errors });
      }
    };
    if (isNewMode) {
      createItemMutate(form).then(onSuccess).catch(onError);
    } else {
      editItemMutate([itemId, form]).then(onSuccess).catch(onError);
    }
  };

  return (
    <div class={classNames(CLASSES.PAGE_FORM_ITEM)}>
      <Formik
        enableReinitialize={true}
        validationSchema={isNewMode ? CreateItemFormSchema : EditItemFormSchema}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <Form>
          <div class={classNames(CLASSES.PAGE_FORM_BODY)}>
            <ItemFormPrimarySection />
            <ItemFormBody accounts={accounts} />
            <ItemFormInventorySection accounts={accounts} />
          </div>

          <ItemFormFloatingActions />
        </Form>
      </Formik>
    </div>
  );
}

export default compose(
  withSettings(({ itemsSettings }) => ({
    preferredCostAccount: parseInt(itemsSettings?.costAccount),
    preferredSellAccount: parseInt(itemsSettings?.sellAccount),
    preferredInventoryAccount: parseInt(itemsSettings?.inventoryAccount),
  })),
)(ItemForm);
