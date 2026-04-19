// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';
import { EmptyStatus, Button } from '@/components';
import { FormattedMessage as T } from '@/components';

/**
 * Assets empty status.
 */
export default function AssetsEmptyStatus() {
  const history = useHistory();

  const handleAddAsset = () => {
    history.push('/assets/new');
  };

  return (
    <EmptyStatus
      title={<T id={'assets_empty_status_title'} />}
      description={<T id={'assets_empty_status_description'} />}
      action={
        <Button intent="primary" onClick={handleAddAsset}>
          <T id={'new_asset'} />
        </Button>
      }
    />
  );
}
