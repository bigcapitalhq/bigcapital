import { Intent } from '@blueprintjs/core';
import { Form } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { AuthSubmitButton } from './_components';
import { FFormGroup, FInputGroup, FormattedMessage as T } from '@/components';

/**
 * Reset password form.
 */
export function ResetPasswordForm({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Form>
      <FFormGroup name={'password'} label={intl.get('new_password')}>
        <FInputGroup name={'password'} type={'password'} large={true} />
      </FFormGroup>

      <FFormGroup name={'confirm_password'} label={intl.get('new_password')}>
        <FInputGroup name={'confirm_password'} type={'password'} large={true} />
      </FFormGroup>

      <AuthSubmitButton
        fill={true}
        intent={Intent.PRIMARY}
        type="submit"
        loading={isSubmitting}
        large={true}
      >
        <T id={'submit'} />
      </AuthSubmitButton>
    </Form>
  );
}
