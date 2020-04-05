import React, { useState } from 'react';
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
import { omit, pick } from 'lodash';
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
  const [state, setState] = useState({
    selectedParentCategory: null
  });
  const intl = useIntl();
  const ValidationSchema = Yup.object().shape({
    name: Yup.string().required(intl.formatMessage({ id: 'required' })),
    parent_category_id: Yup.string().nullable(),
    description: Yup.string().trim()
  });

  const initialValues = {
    name: '',
    description: '',
    parent_category_id: null
  };
  //Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...(payload.action === 'edit' &&
        pick(editItemCategory, Object.keys(initialValues)))
    },
    validationSchema: ValidationSchema,
    onSubmit: values => {
      if (payload.action === 'edit') {
        requestEditItemCategory(payload.id, values).then(response => {
          closeDialog(name);
          AppToaster.show({
            message: 'the_category_has_been_edited'
          });
        });
      } else {
        requestSubmitItemCategory(values)
          .then(response => {
            closeDialog(name);
            AppToaster.show({
              message: 'the_category_has_been_submit'
            });
          })
          .catch(error => {
            alert(error.message);
          });
      }
    }
  });

  const filterItemCategory = (query, category, _index, exactMatch) => {
    const normalizedTitle = category.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return normalizedTitle.indexOf(normalizedQuery) >= 0;
    }
  };

  const parentCategoryItem = (category, { handleClick, modifiers, query }) => {
    return (
      <MenuItem text={category.name} key={category.id} onClick={handleClick} />
    );
  };
  const handleClose = () => {
    closeDialog(name);
  };

  const fetchHook = useAsync(async () => {
    await Promise.all([requestFetchItemCategories()]);
  }, false);

  const onDialogOpening = () => {
    fetchHook.execute();
  };

  const onChangeParentCategory = parentCategory => {
    setState({ ...state, selectedParentCategory: parentCategory.name });
    formik.setFieldValue('parent_category_id', parentCategory.id);
  };

  const onDialogClosed = () => {
    formik.resetForm();
    closeDialog(name);
  };

  return (
    <Dialog
      name={name}
      title={payload.action === 'edit' ? 'Edit Category' : ' New Category'}
      className={{
        'dialog--loading': state.isLoading,
        'dialog--item-form': true
      }}
      isOpen={isOpen}
      onClosed={onDialogClosed}
      onOpening={onDialogOpening}
      isLoading={fetchHook.pending}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            label={'Category Name'}
            className={'form-group--category-name'}
            intent={formik.errors.name && Intent.DANGER}
            helperText={formik.errors.name && formik.errors.name}
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={formik.errors.name && Intent.DANGER}
              {...formik.getFieldProps('name')}
            />
          </FormGroup>

          <FormGroup
            label={'Parent Category'}
            className="{'form-group--parent-category'}"
            inline={true}
            helperText={
              formik.errors.parent_category_id &&
              formik.errors.parent_category_id
            }
            intent={formik.errors.parent_category_id && Intent.DANGER}
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
                text={state.selectedParentCategory || 'Select Parent Category'}
              />
            </Select>
          </FormGroup>

          <FormGroup
            label={'Description'}
            className={'form-group--description'}
            intent={formik.errors.description && Intent.DANGER}
            helperText={formik.errors.description && formik.errors.credential}
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
