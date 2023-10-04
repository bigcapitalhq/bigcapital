// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { Intent, Button } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';

import { FormattedMessage as T } from '@/components';

/**
 * Role form floating actions.
 * @returns {React.JSX}
 */
export function RoleFormFloatingActions() {
  // Formik form context.
  const { isSubmitting } = useFormikContext();

  // History context.
  const history = useHistory();

  // Handle close click.
  const handleCloseClick = () => {
    history.go(-1);
  };

  return (
    <RoleFormFloatingActionsRoot>
      <Button
        intent={Intent.PRIMARY}
        loading={isSubmitting}
        type="submit"
        style={{ minWidth: '90px' }}
      >
        <T id={'save'} />
      </Button>
      <Button onClick={handleCloseClick} disabled={isSubmitting}>
        <T id={'cancel'} />
      </Button>
    </RoleFormFloatingActionsRoot>
  );
}

const RoleFormFloatingActionsRoot = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #fff;
  padding: 14px 18px;
  border-top: 1px solid #d2dde2;
  box-shadow: 0px -1px 4px 0px rgb(0 0 0 / 5%);

  .bp4-button {
    margin-right: 10px;
  }
`;
