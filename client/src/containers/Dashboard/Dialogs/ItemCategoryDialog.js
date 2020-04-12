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
import { useIntl } from 'react-intl';
import { useFormik } from 'formik';
import { compose } from 'utils';
import Dialog from 'components/Dialog';
import useAsync from 'hooks/async';
import AppToaster from 'components/AppToaster';
import DialogConnect from 'connectors/Dialog.connector';
import DialogReduxConnect from 'components/DialogReduxConnect';
import ItemsCategoryConnect from 'connectors/ItemsCategory.connect';
import ErrorMessage from 'components/ErrorMessage';
import classNames from 'classnames';
import Icon from 'components/Icon';

function ItemCategoryDialog({
  name,
  payload,
  isOpen,
  openDialog,
  closeDialog,
  categories,
  requestSubmitItemCategory,
  requestFetchItemCategories,
  requestEditItemCategory,
  editItemCategory
}) {
  const [selectedParentCategory, setParentCategory] = useState(null);

  const intl = useIntl();
  const ValidationSchema = Yup.object().shape({
    name: Yup.string().required(intl.formatMessage({ id: 'required' })),
    parent_category_id: Yup.string().nullable(),
    description: Yup.string().trim()
  });

  const initialValues = useMemo(() => ({
    name: '',
    description: '',
    parent_category_id: null
  }), []);

  //Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...(payload.action === 'edit' &&
        pick(editItemCategory, Object.keys(initialValues)))
    },
    validationSchema: ValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      if (payload.action === 'edit') {
        requestEditItemCategory(payload.id, values).then(response => {
          closeDialog(name);
          AppToaster.show({
            message: 'the_category_has_been_edited'
          });
          setSubmitting(false);
        }).catch((error) => {
          setSubmitting(false);
        });
      } else {
        requestSubmitItemCategory(values)
          .then((response) => {
            closeDialog(name);
            AppToaster.show({
              message: 'the_category_has_been_submit'
            });
            setSubmitting(false);
          })
          .catch((error) => {
            setSubmitting(false);
          });
      }
    }
  });
  const { values, errors, touched } = useMemo(() => formik, [formik]);

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

  const handleClose = useCallback(() => { closeDialog(name); }, [name, closeDialog]);

  const fetchHook = useAsync(async () => {
    await Promise.all([
      requestFetchItemCategories(),
    ]);
  }, false);

  const onDialogOpening = useCallback(() => { fetchHook.execute(); }, [fetchHook]);

  const onChangeParentCategory = useCallback((parentCategory) => {
    setParentCategory(parentCategory);
    formik.setFieldValue('parent_category_id', parentCategory.id);
  }, [formik]);

  const onDialogClosed = useCallback(() => {
    formik.resetForm();
    closeDialog(name);
  }, [formik, closeDialog, name]);

  const requiredSpan = useMemo(() => (<span class="required">*</span>), []);
  const infoIcon = useMemo(() => (<Icon icon="info-circle" iconSize={12} />), []);

  return (
    <Dialog
      name={name}
      title={payload.action === 'edit' ? 'Edit Category' : ' New Category'}
      className={classNames({
        'dialog--loading': fetchHook.pending,
      },
        'dialog--category-form',
      )}
      isOpen={isOpen}
      onClosed={onDialogClosed}
      onOpening={onDialogOpening}
      isLoading={fetchHook.pending}
      onClose={handleClose}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            label={'Category Name'}
            labelInfo={requiredSpan}
            className={'form-group--category-name'}
            intent={(errors.name && touched.name) && Intent.DANGER}
            helperText={(<ErrorMessage name="name" {...formik} />)}
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={(errors.name && touched.name) && Intent.DANGER}
              {...formik.getFieldProps('name')}
            />
          </FormGroup>

          <FormGroup
            label={'Parent Category'}
            labelInfo={infoIcon}
            className={classNames(
              'form-group--select-list',
              'form-group--parent-category',
              Classes.FILL,
            )}
            inline={true}
            helperText={(<ErrorMessage name="parent_category_id" {...formik} />)}
            intent={(errors.parent_category_id && touched.parent_category_id) && Intent.DANGER}
          >
            <Select
              items={Object.values(categories)}
              noResults={<MenuItem disabled={true} text='No results.' />}
              itemRenderer={parentCategoryItem}
              itemPredicate={filterItemCategory}
              popoverProps={{ minimal: true }}
              onItemSelect={onChangeParentCategory}
            >
              <Button
                rightIcon='caret-down'
                text={selectedParentCategory
                  ? selectedParentCategory.name : 'Select Parent Category'}
              />
            </Select>
          </FormGroup>

          <FormGroup
            label={'Description'}
            className={'form-group--description'}
            intent={(errors.description && touched.description) && Intent.DANGER}
            helperText={(<ErrorMessage name="description" {...formik} />)}
            inline={true}
          >
            <TextArea
              growVertically={true}
              large={true}
              {...formik.getFieldProps('description')}
            />
          </FormGroup>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={handleClose}>Close</Button>
            <Button intent={Intent.PRIMARY} type='submit'>
              {payload.action === 'edit' ? 'Edit' : 'Submit'}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}

export default compose(
  ItemsCategoryConnect,
  DialogConnect,
  DialogReduxConnect
)(ItemCategoryDialog);
