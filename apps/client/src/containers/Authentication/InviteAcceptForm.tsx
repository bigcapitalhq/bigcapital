// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import { Intent, Position } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';
import { isEmpty } from 'lodash';

import { useInviteAcceptContext } from './InviteAcceptProvider';
import { AppToaster } from '@/components';
import { InviteAcceptSchema } from './utils';
import InviteAcceptFormContent from './InviteAcceptFormContent';

export default function InviteAcceptForm() {
  const history = useHistory();

  // Invite accept context.
  const { inviteAcceptMutate, inviteMeta, token } = useInviteAcceptContext();

  // Invite value.
  const inviteValue = {
    organization_name: '',
    invited_email: '',
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
      .then((response) => {
        AppToaster.show({
          message: intl.getHTML(
            'congrats_your_account_has_been_created_and_invited',
            {
              organization_name: inviteValue.organization_name,
            },
          ),

          intent: Intent.SUCCESS,
        });
        history.push('/auth/login');
        setSubmitting(false);
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
          if (errors.find((e) => e.type === 'PHONE_MUMNER.ALREADY.EXISTS')) {
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
    <div className={'invite-form'}>
      <div className={'authentication-page__label-section'}>
        <h3>
          <T id={'welcome_to_bigcapital'} />
        </h3>
        <p>
          <T id={'enter_your_personal_information'} />{' '}
          <b>{inviteValue.organization_name}</b> <T id={'organization'} />
        </p>
      </div>

      <Formik
        validationSchema={InviteAcceptSchema}
        initialValues={inviteValue}
        onSubmit={handleSubmit}
        component={InviteAcceptFormContent}
      />
    </div>
  );
}
