import React, { useMemo, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Intent
} from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { useHistory } from 'react-router-dom';
import { pick } from 'lodash';
import { useIntl } from 'react-intl';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';
import AppToaster from 'components/AppToaster';
import ItemFormPrimarySection from './ItemFormPrimarySection';
import ItemFormBody from './ItemFormBody';
import ItemFormFloatingActions from './ItemFormFloatingActions';
import ItemFormInventorySection from './ItemFormInventorySection';

import withItemsActions from 'containers/Items/withItemsActions';
import withMediaActions from 'containers/Media/withMediaActions';
import useMedia from 'hooks/useMedia';
import withItemDetail from 'containers/Items/withItemDetail';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

/**
 * Item form.
 */
function ItemForm({
  // #withItemActions
  requestSubmitItem,
  requestEditItem,

  itemId,
  itemDetail,
  onFormSubmit,

  // #withDashboardActions
  changePageTitle,
  changePageSubtitle,

  // #withMediaActions
  requestSubmitMedia,
  requestDeleteMedia,
}) {
  const isNewMode = !itemId;

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

  const validationSchema = Yup.object().shape({
    active: Yup.boolean(),
    name: Yup.string()
      .required()
      .label(formatMessage({ id: 'item_name_' })),
    type: Yup.string()
      .trim()
      .required()
      .label(formatMessage({ id: 'item_type_' })),
    sku: Yup.string().trim(),
    cost_price: Yup.number(),
    sell_price: Yup.number(),
    cost_account_id: Yup.number()
      .required()
      .label(formatMessage({ id: 'cost_account_id' })),
    sell_account_id: Yup.number()
      .required()
      .label(formatMessage({ id: 'sell_account_id' })),
    inventory_account_id: Yup.number().when('type', {
      is: (value) => value === 'inventory',
      then: Yup.number().required(),
      otherwise: Yup.number().nullable(),
    }),
    category_id: Yup.number().nullable(),
    stock: Yup.string() || Yup.boolean(),
    sellable: Yup.boolean().required(),
    purchasable: Yup.boolean().required(),
  });

  const defaultInitialValues = useMemo(
    () => ({
      active: true,
      name: '',
      type: 'service',
      sku: '',
      cost_price: 0,
      sell_price: 0,
      cost_account_id: null,
      sell_account_id: null,
      inventory_account_id: null,
      category_id: null,
      note: '',
      sellable: true,
      purchasable: true,
    }),
    [],
  );
  const initialValues = useMemo(
    () => ({
      ...(itemDetail
        ? {
            ...pick(itemDetail, Object.keys(defaultInitialValues)),
          }
        : {
            ...defaultInitialValues,
          }),
    }),
    [itemDetail, defaultInitialValues],
  );

  useEffect(() => {
    (!isNewMode)
      ? changePageTitle(formatMessage({ id: 'edit_item_details' }))
      : changePageTitle(formatMessage({ id: 'new_item' }));
  }, [changePageTitle, isNewMode, formatMessage]);

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, resetForm, setErrors }) => {
    setSubmitting(true);
    const form = { ...values };

    const onSuccess = (response) => {
      AppToaster.show({
        message: formatMessage(
          {
            id: (isNewMode) ?
              'service_has_been_successful_created' : 
              'the_item_has_been_successfully_edited',
          },
          {
            number: itemDetail.id,
          },
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      history.push('/items');
      queryCache.removeQueries(['items-table']);
    };
    const onError = (response) => {
      setSubmitting(false);
    };
    if (isNewMode) {
      requestSubmitItem(form).then(onSuccess).catch(onError);
    } else {
      requestEditItem(form).then(onSuccess).catch(onError);
    }
  };

  const {
    getFieldProps,
    setFieldValue,
    values,
    touched,
    errors,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues,
    onSubmit: handleFormSubmit
  });

  useEffect(() => {
    if (values.item_type) {
      changePageSubtitle(formatMessage({ id: values.item_type }));
    } else {
      changePageSubtitle('');
    }
  }, [values.item_type]);

  const initialAttachmentFiles = useMemo(() => {
    return itemDetail && itemDetail.media
      ? itemDetail.media.map((attach) => ({
          preview: attach.attachment_file,
          upload: true,
          metadata: { ...attach },
        }))
      : [];
  }, [itemDetail]);
 
  const handleDropFiles = useCallback((_files) => {
    setFiles(_files.filter((file) => file.uploaded === false));
  }, [setFiles]);

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

  const handleCancelBtnClick = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <div class={classNames(CLASSES.PAGE_FORM_ITEM)}>
      <form onSubmit={handleSubmit}>
        <div class={classNames(CLASSES.PAGE_FORM_BODY)}>
          <ItemFormPrimarySection
            getFieldProps={getFieldProps}
            setFieldValue={setFieldValue}
            errors={errors}
            touched={touched}
            values={values}
          />
          <ItemFormBody
            getFieldProps={getFieldProps}
            touched={touched}
            errors={errors}
            values={values}
            setFieldValue={setFieldValue}
          />
          <ItemFormInventorySection
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            values={values}
            getFieldProps={getFieldProps}
          />
        </div>
        <ItemFormFloatingActions
          isSubmitting={isSubmitting}
          itemId={itemId}
          onCancelClick={handleCancelBtnClick}
        />
      </form>
    </div>
  );
};

export default compose(
  withItemsActions,
  withItemDetail,
  withDashboardActions,
  withMediaActions,
)(ItemForm);
