import { Intent, Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import type { RolesFormValues } from './types';
import { FormattedMessage as T } from '@/components';

/**
 * Role form floating actions.
 */
export function RoleFormFloatingActions() {
  // Formik form context.
  const { isSubmitting } = useFormikContext<RolesFormValues>();

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
  --color-role-form-floating-bg: #fff;
  --color-role-form-floating-border: #d2dde2;

  .bp4-dark & {
    --color-role-form-floating-bg: var(--color-dark-gray1);
    --color-role-form-floating-border: rgba(255, 255, 255, 0.1);
  }
  position: fixed;
  bottom: 0;
  width: 100%;
  background: var(--color-role-form-floating-bg);
  padding: 14px 18px;
  border-top: 1px solid var(--color-role-form-floating-border);
  box-shadow: 0px -1px 4px 0px rgb(0 0 0 / 5%);

  .bp4-button {
    margin-right: 10px;
  }
`;
