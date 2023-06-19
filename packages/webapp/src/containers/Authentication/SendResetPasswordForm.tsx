// @ts-nocheck
import React from 'react';
import { Intent } from '@blueprintjs/core';
import { Form } from 'formik';
import styled from 'styled-components';

import { FInputGroup, FFormGroup, FormattedMessage as T } from '@/components';
import { AuthSubmitButton } from './_components';

/**
 * Send reset password form.
 */
export default function SendResetPasswordForm({ isSubmitting }) {
  return (
    <Form>
      <TopParagraph>
        Enter the email address associated with your account and we'll send you
        a link to reset your password.
      </TopParagraph>

      <FFormGroup name={'credential'} label={<T id={'email_address'} />}>
        <FInputGroup name={'credential'} large={true} />
      </FFormGroup>

      <AuthSubmitButton
        type={'submit'}
        intent={Intent.PRIMARY}
        fill={true}
        large={true}
        loading={isSubmitting}
      >
        Reset Password
      </AuthSubmitButton>
    </Form>
  );
}

const TopParagraph = styled.p`
  margin-bottom: 1.6rem;
  opacity: 0.8;
`;
