import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { compose } from 'utils';
import DialogConnect from 'connectors/Dialog.connector';
import CurrencyFromDialogConnect from 'connectors/CurrencyFromDialog.connect';
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

export default compose(DialogConnect, CurrencyFromDialogConnect)(Currencies);
