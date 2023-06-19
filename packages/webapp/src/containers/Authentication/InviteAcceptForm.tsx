// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import { Intent, Position } from '@blueprintjs/core';
import { isEmpty } from 'lodash';

import { useInviteAcceptContext } from './InviteAcceptProvider';
import { AppToaster } from '@/components';
import { InviteAcceptSchema } from './utils';
import InviteAcceptFormContent from './InviteAcceptFormContent';
import { AuthInsiderCard } from './_components';

const initialValues = {
  organization_name: '',
  invited_email: '',
  first_name: '',
  last_name: '',
  password: '',
};

export default function InviteAcceptForm() {
  const history = useHistory();

  // Invite accept context.
  const { inviteAcceptMutate, inviteMeta, token } = useInviteAcceptContext();

  // Invite value.
  const inviteFormValue = {
    ...initialValues,
    ...(!isEmpty(inviteMeta)
      ? {
          invited_email: inviteMeta.email,
          organization_name: inviteMeta.organizationName,
        }
      : {}),
  };

  // Handle form submitting.
  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    inviteAcceptMutate([values, token])
      .then(() => {
        AppToaster.show({
          message: intl.getHTML(
            'congrats_your_account_has_been_created_and_invited',
            {
              organization_name: inviteMeta.organizationName,
            },
          ),
          intent: Intent.SUCCESS,
        });
        history.push('/auth/login');
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
          if (errors.find((e) => e.type === 'INVITE.TOKEN.NOT.FOUND')) {
            AppToaster.show({
              message: intl.get('an_unexpected_error_occurred'),
              intent: Intent.DANGER,
              position: Position.BOTTOM,
            });
            history.push('/auth/login');
          }
          if (errors.find((e) => e.type === 'PHONE_NUMBER.ALREADY.EXISTS')) {
            setErrors({
              phone_number: 'This phone number is used in another account.',
            });
          }
          if (errors.find((e) => e.type === 'INVITE.TOKEN.NOT.FOUND')) {
            AppToaster.show({
              message: intl.get('an_unexpected_error_occurred'),
              intent: Intent.DANGER,
              position: Position.BOTTOM,
            });
            history.push('/auth/login');
          }
          setSubmitting(false);
        },
      );
  };

  return (
    <AuthInsiderCard>
      <Formik
        validationSchema={InviteAcceptSchema}
        initialValues={inviteFormValue}
        onSubmit={handleSubmit}
        component={InviteAcceptFormContent}
      />
    </AuthInsiderCard>
  );
}
