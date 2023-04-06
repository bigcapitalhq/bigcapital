// @ts-nocheck
import React, { useState } from 'react';
import intl from 'react-intl-universal';
import { Button, InputGroup, Intent } from '@blueprintjs/core';
import { Form, useFormikContext } from 'formik';
import { Link } from 'react-router-dom';
import { Tooltip2 } from '@blueprintjs/popover2';
import styled from 'styled-components';

import {
  Col,
  FFormGroup,
  FInputGroup,
  Row,
  FormattedMessage as T,
} from '@/components';
import { useInviteAcceptContext } from './InviteAcceptProvider';
import { AuthSubmitButton } from './_components';

/**
 * Invite user form.
 */
export default function InviteUserFormContent() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { inviteMeta } = useInviteAcceptContext();
  const { isSubmitting } = useFormikContext();

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
      <Row>
        <Col md={6}>
          <FFormGroup name={'first_name'} label={<T id={'first_name'} />}>
            <FInputGroup name={'first_name'} large={true} />
          </FFormGroup>
        </Col>

        <Col md={6}>
          <FFormGroup name={'last_name'} label={<T id={'last_name'} />}>
            <FInputGroup name={'last_name'} large={true} />
          </FFormGroup>
        </Col>
      </Row>

      <FFormGroup name={'password'} label={<T id={'password'} />}>
        <FInputGroup
          name={'password'}
          large={true}
          rightElement={lockButton}
          type={showPassword ? 'text' : 'password'}
        />
      </FFormGroup>

      <InviteAcceptFooterParagraphs>
        <p>
          <T id={'you_email_address_is'} /> <b>{inviteMeta.email},</b> <br />
          <T id={'you_will_use_this_address_to_sign_in_to_bigcapital'} />
        </p>
        <p>
          {intl.getHTML('signing_in_or_creating', {
            terms: (msg) => <Link>{msg}</Link>,
            privacy: (msg) => <Link>{msg}</Link>,
          })}
        </p>
      </InviteAcceptFooterParagraphs>

      <InviteAuthSubmitButton
        intent={Intent.PRIMARY}
        type="submit"
        fill={true}
        large={true}
        loading={isSubmitting}
      >
        <T id={'create_account'} />
      </InviteAuthSubmitButton>
    </Form>
  );
}

const InviteAcceptFooterParagraphs = styled.div`
  opacity: 0.8;
`;

const InviteAuthSubmitButton = styled(AuthSubmitButton)`
  margin-top: 1.6rem;
`;
