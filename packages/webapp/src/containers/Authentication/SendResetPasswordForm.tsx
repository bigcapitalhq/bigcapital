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
        <T id={'enter_the_email_address_associated_with_your_account'} />
      </TopParagraph>

      <FFormGroup name={'crediential'} label={<T id={'email_address'} />}>
        <FInputGroup name={'crediential'} large={true} />
      </FFormGroup>

      <AuthSubmitButton
        type={'submit'}
        intent={Intent.PRIMARY}
        fill={true}
        large={true}
        loading={isSubmitting}
      >
        <T id={'reset_password'} />
      </AuthSubmitButton>
    </Form>
  );
}

const TopParagraph = styled.p`
  margin-bottom: 1.6rem;
  opacity: 0.8;
`;
