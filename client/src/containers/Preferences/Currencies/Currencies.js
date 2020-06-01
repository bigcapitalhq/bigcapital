import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { compose } from 'utils';
import withDialog from 'containers/Dialogs/withDialog';

function Currencies({ openDialog }) {
  const onClickNewCurrency = () => {
    openDialog('currency-form',{});
  };

  return (
    <div className={'preferences__inside-content'}>
      <div className={'preferences__tabs'}>
        
      </div>
    </div>
  );
}

export default compose(withDialog)(Currencies);
