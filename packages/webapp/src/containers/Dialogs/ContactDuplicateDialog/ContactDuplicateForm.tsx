import { Button, Intent, Classes } from '@blueprintjs/core';
import { Formik, Form, type FormikHelpers } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { useContactDuplicateFromContext } from './ContactDuplicateProvider';
import type { ContactDuplicateFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  FFormGroup as FFormGroupBase,
  FSelect,
  FieldRequiredHint,
  FormattedMessage as T,
} from '@/components';
import { ContactsOptions } from '@/constants/contactsOptions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

// Widened BP4 wrapper type — `popoverProps` minimal not exposed publicly.
type FFormGroupProps = React.PropsWithChildren<{
  name?: string;
  label?: React.ReactNode;
  labelInfo?: React.ReactNode;
  className?: string;
  inline?: boolean;
  fastField?: boolean;
}>;
const FFormGroup = FFormGroupBase as unknown as React.FC<FFormGroupProps>;

interface ContactDuplicateFormProps extends WithDialogActionsProps {}

function ContactDuplicateFormInner({
  closeDialog,
}: ContactDuplicateFormProps): React.ReactElement {
  const history = useHistory();

  const { dialogName, contactId } = useContactDuplicateFromContext();

  const validationSchema = Yup.object().shape({
    contact_type: Yup.string().required().label(intl.get('contact_type_')),
  });

  const initialValues: ContactDuplicateFormValues = {
    contact_type: '',
  };

  // Handle cancel button click.
  const handleCancelClick = () => {
    closeDialog(dialogName);
  };

  // Handle form submit.
  const handleFormSubmit = (values: ContactDuplicateFormValues) => {
    closeDialog(dialogName);
    history.push(`${values.contact_type}/new?duplicate=${contactId}`, {
      action: contactId,
    });
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={
        handleFormSubmit as (
          values: ContactDuplicateFormValues,
          helpers: FormikHelpers<ContactDuplicateFormValues>,
        ) => void
      }
    >
      {({ isSubmitting }) => (
        <Form>
          <div className={Classes.DIALOG_BODY}>
            <p className="paragraph">
              <T id={'are_you_sure_want_to_duplicate'} />
            </p>

            {/*------------ Contact Type -----------*/}
            <FFormGroup
              name={'contact_type'}
              label={intl.get('contact_type')}
              labelInfo={<FieldRequiredHint />}
            >
              <FSelect
                name={'contact_type'}
                items={ContactsOptions}
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

export const ContactDuplicateForm = compose(withDialogActions)(
  ContactDuplicateFormInner,
);
