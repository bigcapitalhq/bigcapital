import React, { useState } from 'react';
import {
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
  TextArea,
} from '@blueprintjs/core';
import * as Yup from 'yup';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import { compose } from 'utils';
import Dialog from 'components/Dialog';
import useAsync from 'hooks/async';
import AppToaster from 'components/AppToaster';
import DialogConnect from 'connectors/Dialog.connector';
import DialogReduxConnect from 'components/DialogReduxConnect';
import ItemFormDialogConnect from 'connectors/ItemFormDialog.connect';

function ItemFromDialog({
  name,
  payload,
  isOpen,
  submitItemCategory,
  fetchCategory,
  openDialog,
  closeDialog,
}) {
  const [state, setState] = useState({});
  const { formatMessage } = useIntl();
  const ValidationSchema = Yup.object().shape({
    name: Yup.string().required(formatMessage({ id: 'required' })),
    description: Yup.string().trim(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {},
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      submitItemCategory({ values })
        .then((response) => {
          AppToaster.show({
            message: formatMessage({id:'the_category_has_been_successfully_created'}),
          });
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  });

  const fetchHook = useAsync(async () => {
    await Promise.all([submitItemCategory]);
  });

  const handleClose = () => {
    closeDialog(name);
  };

  const onDialogOpening = () => {
    fetchHook.execute();
    openDialog(name);
  };
  const onDialogClosed = () => {
    // formik.resetForm();
    closeDialog(name);
  };

  return (
    <Dialog
      name={name}
      title={
        payload.action === 'new' ? <T id={'new'} /> : <T id={'new_category'} />
      }
      className={{
        'dialog--loading': state.isLoading,
        'dialog--item-form': true,
      }}
      isOpen={isOpen}
      onClosed={onDialogClosed}
      onOpening={onDialogOpening}
      isLoading={fetchHook.pending}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            label={<T id={'category_name'} />}
            className={'form-group--category-name'}
            intent={formik.errors.name && Intent.DANGER}
            helperText={formik.errors.name && formik.errors.name}
            inline={true}
          >
            <InputGroup
              medium={formik.values.toString()}
              intent={formik.errors.name && Intent.DANGER}
              {...formik.getFieldProps('name')}
            />
          </FormGroup>
          <FormGroup
            label={<T id={'description'} />}
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
            <Button onClick={handleClose}>
              <T id={'close'} />
            </Button>
            <Button intent={Intent.PRIMARY} type='submit'>
              {payload.action === 'new' ? (
                <T id={'new'} />
              ) : (
                <T id={'submit'} />
              )}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}

export default compose(
  ItemFormDialogConnect,
  DialogConnect,
  DialogReduxConnect
)(ItemFromDialog);
