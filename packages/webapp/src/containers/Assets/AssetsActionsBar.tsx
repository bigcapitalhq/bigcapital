// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  DashboardActionsBar,
  Button,
  FormattedMessage as T,
} from '@/components';
import { Icon } from '@blueprintjs/core';
import { useAssetsListContext } from './AssetsListProvider';

/**
 * Assets actions bar.
 */
export function AssetsActionsBar() {
  const history = useHistory();
  const { selectedRows } = useAssetsListContext();

  const handleAddAsset = () => {
    history.push('/assets/new');
  };

  return (
    <DashboardActionsBar>
      <Button
        intent="primary"
        onClick={handleAddAsset}
        icon={<Icon icon="plus" iconSize={16} />}
      >
        <T id={'new_asset'} />
      </Button>
    </DashboardActionsBar>
  );
}
