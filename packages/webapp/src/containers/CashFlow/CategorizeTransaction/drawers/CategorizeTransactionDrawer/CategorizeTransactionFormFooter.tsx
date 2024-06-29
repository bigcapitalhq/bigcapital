// @ts-nocheck
import * as R from 'ramda';
import { Button, Classes, Intent } from '@blueprintjs/core';
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
      <div className={Classes.DRAWER_FOOTER}>
        <Group spacing={10}>
          <Button
            intent={Intent.PRIMARY}
            style={{ minWidth: '75px' }}
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
      </div>
    </Root>
  );
}

export const CategorizeTransactionFormFooter = R.compose(withBankingActions)(
  CategorizeTransactionFormFooterRoot,
);

const Root = styled.div`
  // position: absolute;
  // bottom: 0;
  // left: 0;
  // right: 0;
  // background: #fff;
`;
