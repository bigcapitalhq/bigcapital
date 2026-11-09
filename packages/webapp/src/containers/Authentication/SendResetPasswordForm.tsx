import { Intent } from '@blueprintjs/core';
import { Form } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { AuthSubmitButton } from './_components';
import { FInputGroup, FFormGroup, FormattedMessage as T } from '@/components';

/**
 * Send reset password form.
 */
export function SendResetPasswordForm({
  isSubmitting,
}: {
  isSubmitting: boolean;
}) {
  return (
    <Form>
      <TopParagraph>
        <T id={'enter_the_email_address_associated_with_your_account'} />
      </TopParagraph>

      <FFormGroup name={'crediential'} label={intl.get('email_address')}>
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
