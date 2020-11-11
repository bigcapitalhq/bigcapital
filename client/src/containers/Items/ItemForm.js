import React, { useMemo, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik, Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { useHistory } from 'react-router-dom';
import { pick, pickBy } from 'lodash';
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

import { compose, transformToForm } from 'utils';

const defaultInitialValues = {
  active: true,
  name: '',
  type: 'service',
  sku: '',
  cost_price: '',
  sell_price: '',
  cost_account_id: '',
  sell_account_id: '',
  inventory_account_id: '',
  category_id: '',
  note: '',
  sellable: true,
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
    cost_price: Yup.number().when(['purchasable'], {
      is: true,
      then: Yup.number().required(),
      otherwise: Yup.number().nullable(true),
    }),
    sell_price: Yup.number().when(['sellable'], {
      is: true,
      then: Yup.number().required(),
      otherwise: Yup.number().nullable(true),
    }),
    cost_account_id: Yup.number()
      .when(['purchasable'], {
        is: true,
        then: Yup.number().required(),
        otherwise: Yup.number().nullable(true),
      })
      .label(formatMessage({ id: 'cost_account_id' })),
    sell_account_id: Yup.number()
      .when(['sellable'], {
        is: true,
        then: Yup.number().required(),
        otherwise: Yup.number().nullable(),
      })
      .label(formatMessage({ id: 'sell_account_id' })),
    inventory_account_id: Yup.number()
      .when(['type'], {
        is: (value) => value === 'inventory',
        then: Yup.number().required(),
        otherwise: Yup.number().nullable(),
      })
      .label(formatMessage({ id: 'inventory_account' })),
    category_id: Yup.number().positive().nullable(),
    stock: Yup.string() || Yup.boolean(),
    sellable: Yup.boolean().required(),
    purchasable: Yup.boolean().required(),
  });

  /**
   * Initial values in create and edit mode.
   */
  const initialValues = useMemo(
    () => ({
      ...defaultInitialValues,

      /**
       * We only care about the fields in the form. Previously unfilled optional
       * values such as `notes` come back from the API as null, so remove those
       * as well.
       */
      ...transformToForm(itemDetail, defaultInitialValues),
    }),
    [],
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
              ? 'service_has_been_successful_created'
              : 'the_item_has_been_successfully_edited',
          },
          {
            number: itemId,
          },
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      history.push('/items');
      queryCache.removeQueries(['items-table']);
    };
    const onError = ({ response }) => {
      setSubmitting(false);

      if (response.data.errors) {
        const _errors = transformApiErrors(response.data.errors);
        setErrors({ ..._errors });
      }
    };
    if (isNewMode) {
      requestSubmitItem(form).then(onSuccess).catch(onError);
    } else {
      requestEditItem(itemId, form).then(onSuccess).catch(onError);
    }
  };

  // useEffect(() => {
  //   if (values.item_type) {
  //     changePageSubtitle(formatMessage({ id: values.item_type }));
  //   } else {
  //     changePageSubtitle('');
  //   }
  // }, [values.item_type, changePageSubtitle, formatMessage]);

  const initialAttachmentFiles = useMemo(() => {
    return itemDetail && itemDetail.media
      ? itemDetail.media.map((attach) => ({
          preview: attach.attachment_file,
          upload: true,
          metadata: { ...attach },
        }))
      : [];
  }, [itemDetail]);

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

  const handleCancelBtnClick = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <div class={classNames(CLASSES.PAGE_FORM_ITEM)}>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div class={classNames(CLASSES.PAGE_FORM_BODY)}>
              <ItemFormPrimarySection />
              <ItemFormBody />
              <ItemFormInventorySection />
            </div>
            <ItemFormFloatingActions
              isSubmitting={isSubmitting}
              itemId={itemId}
              onCancelClick={handleCancelBtnClick}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default compose(
  withItemsActions,
  withItemDetail,
  withDashboardActions,
  withMediaActions,
)(ItemForm);
