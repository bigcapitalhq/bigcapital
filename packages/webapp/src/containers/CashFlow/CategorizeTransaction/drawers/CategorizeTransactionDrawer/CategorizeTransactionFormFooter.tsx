import { Button, Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import styled from 'styled-components';
import type { WithBankingActionsProps } from '@/containers/CashFlow/withBankingActions';
import { Group } from '@/components';
import { withBankingActions } from '@/containers/CashFlow/withBankingActions';
import { compose } from '@/utils';

interface CategorizeTransactionFormFooterRootProps
  extends Pick<WithBankingActionsProps, 'closeMatchingTransactionAside'> {}

function CategorizeTransactionFormFooterRoot({
  // #withBankingActions
  closeMatchingTransactionAside,
}: CategorizeTransactionFormFooterRootProps) {
  const { isSubmitting } = useFormikContext();

  const handleClose = () => {
    closeMatchingTransactionAside();
  };

  return (
    <Root>
      <Group spacing={10}>
        <Button
          intent={Intent.PRIMARY}
          style={{ minWidth: '85px' }}
          loading={isSubmitting}
          type="submit"
        >
          Save
        </Button>

        <Button
          disabled={isSubmitting}
          onClick={handleClose}
          style={{ minWidth: '75px' }}
        >
          Close
        </Button>
      </Group>
    </Root>
  );
}

export const CategorizeTransactionFormFooter = compose(withBankingActions)(
  CategorizeTransactionFormFooterRoot,
);

const Root = styled.div`
  border-top: 1px solid var(--color-aside-divider);
  padding: 14px 20px;
`;
