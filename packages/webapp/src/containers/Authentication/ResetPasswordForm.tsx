// @ts-nocheck
import React from 'react';
import { Intent } from '@blueprintjs/core';
import { Form } from 'formik';
import { FFormGroup, FInputGroup, FormattedMessage as T } from '@/components';
import { AuthSubmitButton } from './_components';

/**
 * Reset password form.
 */
export default function ResetPasswordForm({ isSubmitting }) {
  return (
    <Form>
      <FFormGroup name={'password'} label={<T id={'new_password'} />}>
        <FInputGroup name={'password'} type={'password'} large={true} />
      </FFormGroup>

      <FFormGroup name={'confirm_password'} label={<T id={'new_password'} />}>
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
