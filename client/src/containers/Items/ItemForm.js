import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { defaultTo } from 'lodash';

import { CLASSES } from 'common/classes';
import AppToaster from 'components/AppToaster';
import ItemFormPrimarySection from './ItemFormPrimarySection';
import ItemFormBody from './ItemFormBody';
import ItemFormFloatingActions from './ItemFormFloatingActions';
import ItemFormInventorySection from './ItemFormInventorySection';

import withItemsActions from 'containers/Items/withItemsActions';
import withMediaActions from 'containers/Media/withMediaActions';
import useMedia from 'hooks/useMedia';
import withItem from 'containers/Items/withItem';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withSettings from 'containers/Settings/withSettings';

import { compose, transformToForm } from 'utils';
import { transitionItemTypeKeyToLabel } from './utils';
import {
  EditItemFormSchema,
  CreateItemFormSchema,
  transformItemFormData,
} from './ItemForm.schema';

import 'style/pages/Items/PageForm.scss';

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
};

/**
 * Item form.
 */
function ItemForm({
  // #withItemActions
  requestSubmitItem,
  requestEditItem,

  itemId,
  item,
  onFormSubmit,

  // #withDashboardActions
  changePageTitle,
  changePageSubtitle,

  // #withSettings
  preferredCostAccount,
  preferredSellAccount,
  preferredInventoryAccount,

  // #withMediaActions
  requestSubmitMedia,
  requestDeleteMedia,
}) {
  const isNewMode = !itemId;

  // Holds data of submit button once clicked to form submit function.
  const [submitPayload, setSubmitPayload] = useState({});

  const history = useHistory();
  const { formatMessage } = useIntl();

  const {
    setFiles,
    saveMedia,
    deletedFiles,
    setDeletedFiles,
    deleteMedia,
  } = useMedia({
    saveCallback: requestSubmitMedia,
    deleteCallback: requestDeleteMedia,
  });

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

  useEffect(() => {
    !isNewMode
      ? changePageTitle(formatMessage({ id: 'edit_item_details' }))
      : changePageTitle(formatMessage({ id: 'new_item' }));
  }, [changePageTitle, isNewMode, formatMessage]);

  const transformApiErrors = (errors) => {
    const fields = {};
    if (errors.find((e) => e.type === 'ITEM.NAME.ALREADY.EXISTS')) {
      fields.name = formatMessage({ id: 'the_name_used_before' });
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
      queryCache.removeQueries(['items-table']);

      if (submitPayload.redirect) {
        history.push('/items');
      }
    };
    const onError = (errors) => {
      setSubmitting(false);
      if (errors) {
        const _errors = transformApiErrors(errors);
        setErrors({ ..._errors });
      }
    };
    if (isNewMode) {
      requestSubmitItem(form).then(onSuccess).catch(onError);
    } else {
      requestEditItem(itemId, form).then(onSuccess).catch(onError);
    }
  };

  useEffect(() => {
    if (item && item.type) {
      changePageSubtitle(transitionItemTypeKeyToLabel(item.type));
    }
  }, [item, changePageSubtitle, formatMessage]);

  const initialAttachmentFiles = useMemo(() => {
    return item && item.media
      ? item.media.map((attach) => ({
          preview: attach.attachment_file,
          upload: true,
          metadata: { ...attach },
        }))
      : [];
  }, [item]);

  const handleDropFiles = useCallback(
    (_files) => {
      setFiles(_files.filter((file) => file.uploaded === false));
    },
    [setFiles],
  );

  const handleDeleteFile = useCallback(
    (_deletedFiles) => {
      _deletedFiles.forEach((deletedFile) => {
        if (deletedFile.uploaded && deletedFile.metadata.id) {
          setDeletedFiles([...deletedFiles, deletedFile.metadata.id]);
        }
      });
    },
    [setDeletedFiles, deletedFiles],
  );

  const handleCancelBtnClick = () => {
    history.goBack();
  };

  const handleSubmitAndNewClick = () => {
    setSubmitPayload({ redirect: false });
  };

  const handleSubmitClick = () => {
    setSubmitPayload({ redirect: true });
  };

  return (
    <div class={classNames(CLASSES.PAGE_FORM_ITEM)}>
      <Formik
        enableReinitialize={true}
        validationSchema={isNewMode ? CreateItemFormSchema : EditItemFormSchema}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting, handleSubmit }) => (
          <Form>
            <div class={classNames(CLASSES.PAGE_FORM_BODY)}>
              <ItemFormPrimarySection itemType={item?.type} />
              <ItemFormBody />
              <ItemFormInventorySection />
            </div>
            <ItemFormFloatingActions
              isSubmitting={isSubmitting}
              itemId={itemId}
              handleSubmit={handleSubmit}
              onCancelClick={handleCancelBtnClick}
              onSubmitAndNewClick={handleSubmitAndNewClick}
              onSubmitClick={handleSubmitClick}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default compose(
  withItemsActions,
  withItem(({ item }) => ({ item })),
  withDashboardActions,
  withMediaActions,
  withSettings(({ itemsSettings }) => ({
    preferredCostAccount: parseInt(itemsSettings?.preferredCostAccount),
    preferredSellAccount: parseInt(itemsSettings?.preferredSellAccount),
    preferredInventoryAccount: parseInt(
      itemsSettings?.preferredInventoryAccount,
    ),
  })),
)(ItemForm);
