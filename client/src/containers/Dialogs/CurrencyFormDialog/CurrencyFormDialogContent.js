import React from 'react';
import { CurrencyFormProvider } from './CurrencyFormProvider';
import { pick } from 'lodash';

import CurrencyForm from './CurrencyForm';
import withCurrencyDetail from 'containers/Currencies/withCurrencyDetail';

import { compose } from 'utils';
import 'style/pages/Currency/CurrencyFormDialog.scss';

function CurrencyFormDialogContent({
  // #ownProp
  action,
  currency,
  dialogName,
}) {
  return (
    <CurrencyFormProvider
      isEditMode={action}
      currency={currency}
      dialogName={dialogName}
    >
      <CurrencyForm />
    </CurrencyFormProvider>
  );
}

export default compose(withCurrencyDetail)(CurrencyFormDialogContent);
