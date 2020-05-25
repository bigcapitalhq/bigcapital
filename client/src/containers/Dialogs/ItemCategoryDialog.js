import React, { useState, useMemo, useCallback } from 'react';
import {
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
  TextArea,
  MenuItem
} from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { pick } from 'lodash';
import * as Yup from 'yup';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import { compose } from 'utils';
import { useQuery, queryCache } from 'react-query';
import classNames from 'classnames';
import {connect} from 'react-redux';

import AppToaster from 'components/AppToaster';
import ErrorMessage from 'components/ErrorMessage';

import Dialog from 'components/Dialog';
import DialogConnect from 'connectors/Dialog.connector';
import DialogReduxConnect from 'components/DialogReduxConnect';

import { getDialogPayload } from 'store/dashboard/dashboard.reducer';
import withItemCategoryDetail from 'containers/Items/withItemCategoryDetail';
import withItemCategories from 'containers/Items/withItemCategories';
import withItemCategoriesActions from 'containers/Items/withItemCategoriesActions';

import Icon from 'components/Icon';


function ItemCategoryDialog({
  name,
  payload,
  isOpen,

  // #withDialog
  openDialog,
  closeDialog,

  // #withItemCategoryDetail
  itemCategoryId,
  itemCategory,

  // #withItemCategories
  categoriesList,

  // #withItemCategoriesActions
  requestSubmitItemCategory,
  requestFetchItemCategories,
  requestEditItemCategory,
}) {
  const [selectedParentCategory, setParentCategory] = useState(null);
  const { formatMessage } = useIntl();

  const fetchList = useQuery(['items-categories-list'],
    () => requestFetchItemCategories());

  const validationSchema = Yup.object().shape({
    name: Yup.string().required().label(formatMessage({id:'category_name_'})),
    parent_category_id: Yup.string().nullable(),
    description: Yup.string().trim()
  });

  const initialValues = useMemo(() => ({
    name: '',
    description: '',
    parent_category_id: null
  }), []);

  // Formik
  const {
    errors,
    touched,
    setFieldValue,
    handleSubmit,
    resetForm,
    getFieldProps,
    isSubmitting,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...(payload.action === 'edit' &&
        pick(itemCategory, Object.keys(initialValues)))
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      if (payload.action === 'edit') {
        requestEditItemCategory(payload.id, values).then(response => {
          closeDialog(name);
          AppToaster.show({
            message: formatMessage({
              id: 'the_item_category_has_been_successfully_edited',
            }),
            intent: Intent.SUCCESS,
          });
          setSubmitting(false);
          queryCache.refetchQueries('items-categories-table', { force: true });
        }).catch((error) => {
          setSubmitting(false);
        });
      } else {
        requestSubmitItemCategory(values)
          .then((response) => {
            closeDialog(name);
            AppToaster.show({
              message: formatMessage({
                id: 'the_item_category_has_been_successfully_created',
              }),
              intent: Intent.SUCCESS,
            });
            setSubmitting(false);
            queryCache.refetchQueries('items-categories-table', { force: true });
          })
          .catch((error) => {
            setSubmitting(false);
          });
      }
    }
  });

  const filterItemCategory = useCallback((query, category, _index, exactMatch) => {
    const normalizedTitle = category.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return normalizedTitle.indexOf(normalizedQuery) >= 0;
    }
  }, []);

  const parentCategoryItem = useCallback((category, { handleClick, modifiers, query }) => {
    return (
      <MenuItem text={category.name} key={category.id} onClick={handleClick} />
    );
  }, []);

  // Handle the dialog closing.
  const handleClose = useCallback(() => { closeDialog(name); }, [name, closeDialog]);

  // Handle the dialog opening.
  const onDialogOpening = useCallback(() => {
    fetchList.refetch();
  }, [fetchList]);

  const onChangeParentCategory = useCallback((parentCategory) => {
    setParentCategory(parentCategory);
    setFieldValue('parent_category_id', parentCategory.id);
  }, [setFieldValue]);

  const onDialogClosed = useCallback(() => {
    resetForm();
    closeDialog(name);
  }, [resetForm, closeDialog, name]);

  const requiredSpan = useMemo(() => (<span class="required">*</span>), []);
  const infoIcon = useMemo(() => (<Icon icon="info-circle" iconSize={12} />), []);

  return (
    <Dialog
      name={name}
      title={payload.action === 'edit' ? <T id={'edit_category'}/> : <T id={'new_category'}/>}
      className={classNames({
        'dialog--loading': fetchList.isFetching,
      },
        'dialog--category-form',
      )}
      isOpen={isOpen}
      onClosed={onDialogClosed}
      onOpening={onDialogOpening}
      isLoading={fetchList.isFetching}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit}>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            label={<T id={'category_name'}/>}
            labelInfo={requiredSpan}
            className={'form-group--category-name'}
            intent={(errors.name && touched.name) && Intent.DANGER}
            helperText={(<ErrorMessage name="name" {...{ errors, touched }} />)}
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={(errors.name && touched.name) && Intent.DANGER}
              {...getFieldProps('name')}
            />
          </FormGroup>

          <FormGroup
            label={<T id={'parent_category'}/>}
            labelInfo={infoIcon}
            className={classNames(
              'form-group--select-list',
              'form-group--parent-category',
              Classes.FILL,
            )}
            inline={true}
            helperText={(<ErrorMessage name="parent_category_id" {...{errors, touched}} />)}
            intent={(errors.parent_category_id && touched.parent_category_id) && Intent.DANGER}
          >
            <Select
              items={categoriesList}
              noResults={<MenuItem disabled={true} text='No results.' />}
              itemRenderer={parentCategoryItem}
              itemPredicate={filterItemCategory}
              popoverProps={{ minimal: true }}
              onItemSelect={onChangeParentCategory}
            >
              <Button
                text={selectedParentCategory
                  ? selectedParentCategory.name : 'Select Parent Category'}
              />
            </Select>
          </FormGroup>

          <FormGroup
            label={<T id={'description'}/>}
            className={'form-group--description'}
            intent={(errors.description && touched.description) && Intent.DANGER}
            helperText={(<ErrorMessage name="description" {...{errors, touched}} />)}
            inline={true}
          >
            <TextArea
              growVertically={true}
              large={true}
              {...getFieldProps('description')}
            />
          </FormGroup>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={handleClose}><T id={'close'}/></Button>
            <Button intent={Intent.PRIMARY} type='submit' disabled={isSubmitting}>
              {payload.action === 'edit' ? <T id={'edit'}/> : <T id={'submit'}/>}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}


const mapStateToProps = (state, props) => {
  const dialogPayload = getDialogPayload(state, 'item-category-form');

  return {
    name: 'item-category-form',
    payload: {action: 'new', id: null, ...dialogPayload},
    itemCategoryId: dialogPayload?.id || null,
  };
};

const withItemCategoryDialog = connect(mapStateToProps);

export default compose( 
  withItemCategoryDialog,
  DialogConnect,
  DialogReduxConnect,
  withItemCategoryDetail,
  withItemCategories(({ categoriesList }) => ({
    categoriesList
  })),
  withItemCategoriesActions 
)(ItemCategoryDialog);
