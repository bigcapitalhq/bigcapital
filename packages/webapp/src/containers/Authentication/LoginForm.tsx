// @ts-nocheck
import React, { useState } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { Form } from 'formik';
import { Tooltip2 } from '@blueprintjs/popover2';

import { FFormGroup, FInputGroup, FCheckbox, T } from '@/components';
import { AuthSubmitButton } from './_components';

/**
 * Login form.
 */
export default function LoginForm({ isSubmitting }) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Handle password revealer changing.
  const handleLockClick = () => {
    setShowPassword(!showPassword);
  };

  const lockButton = (
    <Tooltip2 content={`${showPassword ? 'Hide' : 'Show'} Password`}>
      <Button
        icon={showPassword ? 'unlock' : 'lock'}
        intent={Intent.WARNING}
        minimal={true}
        onClick={handleLockClick}
        small={true}
      />
    </Tooltip2>
  );

  return (
    <Form>
      <FFormGroup name={'credential'} label={<T id={'email_address'} />}>
        <FInputGroup name={'credential'} large={true} />
      </FFormGroup>

      <FFormGroup name={'password'} label={<T id={'password'} />}>
        <FInputGroup
          name={'password'}
          large={true}
          type={showPassword ? 'text' : 'password'}
          rightElement={lockButton}
        />
      </FFormGroup>

      <FCheckbox name={'keepLoggedIn'}>
        <T id={'keep_me_logged_in'} />
      </FCheckbox>

      <AuthSubmitButton
        type={'submit'}
        intent={Intent.PRIMARY}
        fill={true}
        large={true}
        loading={isSubmitting}
      >
        <T id={'log_in'} />
      </AuthSubmitButton>
    </Form>
  );
}
