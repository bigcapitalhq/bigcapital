// @ts-nocheck
import * as R from 'ramda';
import { Button, Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import styled from 'styled-components';
import { Group } from '@/components';
import { withBankingActions } from '@/containers/CashFlow/withBankingActions';

function CategorizeTransactionFormFooterRoot({
  // #withBankingActions
  closeMatchingTransactionAside,
}) {
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

export const CategorizeTransactionFormFooter = R.compose(withBankingActions)(
  CategorizeTransactionFormFooterRoot,
);

const Root = styled.div`
  border-top: 1px solid #c7d5db;
  padding: 14px 20px;
`;
