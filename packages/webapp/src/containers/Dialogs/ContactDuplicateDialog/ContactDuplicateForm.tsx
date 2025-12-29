// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { FFormGroup, FSelect, FieldRequiredHint } from '@/components';
import { Button, Intent, Classes } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';
import { useHistory } from 'react-router-dom';
import { useContactDuplicateFromContext } from './ContactDuplicateProvider';

import Contacts from '@/constants/contactsOptions';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

function ContactDuplicateForm({
  // #withDialogActions
  closeDialog,
}) {
  const history = useHistory();

  const { dialogName, contactId } = useContactDuplicateFromContext();

  const validationSchema = Yup.object().shape({
    contact_type: Yup.string()
      .required()
      .label(intl.get('contact_type_')),
  });

  const initialValues = {
    contact_type: '',
  };

  // Handle cancel button click.
  const handleCancelClick = () => {
    closeDialog(dialogName);
  };

  // Handle form submit.
  const handleFormSubmit = (values) => {
    closeDialog(dialogName);
    history.push(`${values.contact_type}/new?duplicate=${contactId}`, {
      action: contactId,
    });
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className={Classes.DIALOG_BODY}>
            <p class="paragraph">
              <T id={'are_you_sure_want_to_duplicate'} />
            </p>

            {/*------------ Contact Type -----------*/}
            <FFormGroup
              name={'contact_type'}
              label={<T id={'contact_type'} />}
              labelInfo={<FieldRequiredHint />}
              className={'form-group--select-list'}
            >
              <FSelect
                name={'contact_type'}
                items={Contacts}
                placeholder={<T id={'select_contact'} />}
                textAccessor={'name'}
                valueAccessor={'path'}
                filterable={false}
                popoverProps={{ minimal: true }}
              />
            </FFormGroup>
          </div>

          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button onClick={handleCancelClick}>
                <T id={'cancel'} />
              </Button>

              <Button
                intent={Intent.PRIMARY}
                type="submit"
                disabled={isSubmitting}
              >
                <T id={'duplicate'} />
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default compose(withDialogActions)(ContactDuplicateForm);
