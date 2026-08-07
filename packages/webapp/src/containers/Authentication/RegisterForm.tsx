import { Intent, Button } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import { Form } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthSubmitButton, AuthenticationLoadingOverlay } from './_components';
import {
  FFormGroup,
  FInputGroup,
  Row,
  Col,
  FormattedMessage as T,
} from '@/components';

/**
 * Register form.
 */
export function RegisterForm({ isSubmitting }: { isSubmitting: boolean }) {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

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
    <RegisterFormRoot>
      <Row className={'name-section'}>
        <Col md={6}>
          <FFormGroup name={'first_name'} label={intl.get('first_name')}>
            <FInputGroup name={'first_name'} large={true} />
          </FFormGroup>
        </Col>

        <Col md={6}>
          <FFormGroup name={'last_name'} label={intl.get('last_name')}>
            <FInputGroup name={'last_name'} large={true} />
          </FFormGroup>
        </Col>
      </Row>

      <FFormGroup name={'email'} label={intl.get('email')}>
        <FInputGroup name={'email'} large={true} />
      </FFormGroup>

      <FFormGroup name={'password'} label={intl.get('password')}>
        <FInputGroup
          name={'password'}
          type={showPassword ? 'text' : 'password'}
          rightElement={lockButton}
          large={true}
        />
      </FFormGroup>

      <TermsConditionsText>
        {intl.getHTML('signing_in_or_creating', {
          terms: (msg: string) => <Link to={'#'}>{msg}</Link>,
          privacy: (msg: string) => <Link to={'#'}>{msg}</Link>,
        })}
      </TermsConditionsText>

      <AuthSubmitButton
        className={'btn-register'}
        intent={Intent.PRIMARY}
        type="submit"
        fill={true}
        large={true}
        loading={isSubmitting}
      >
        <T id={'register'} />
      </AuthSubmitButton>

      {isSubmitting && <AuthenticationLoadingOverlay />}
    </RegisterFormRoot>
  );
}

const TermsConditionsText = styled.p`
  opacity: 0.8;
  margin-bottom: 1.4rem;
`;

const RegisterFormRoot = styled(Form)`
  position: relative;
`;
