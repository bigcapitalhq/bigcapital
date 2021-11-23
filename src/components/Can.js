import React from 'react';
import { Ability } from '@casl/ability';
import { createContextualCan } from '@casl/react';

import {
  Item_Abilities,
  AbilitySubject,
  Inventory_Adjustment_Abilities,
  SaleEstimate,
  SaleInvoice,
  SaleReceipt,
  PaymentReceive,
  Bill,
  PaymentMade,
} from '../common/abilityOption';

export const AbilityContext = React.createContext();
export const Can = createContextualCan(AbilityContext.Consumer);

const AbilityContextProvider = (props) => {
  const ability = new Ability([
    {
      subject: [AbilitySubject.PaymentMade],
      action: [PaymentMade.Edit],
    },
    {
      subject: [AbilitySubject.Bill],
      action: [Bill.Create],
    },
  ]);

  return (
    <AbilityContext.Provider value={ability}>
      {props.children}
    </AbilityContext.Provider>
  );
};

export default AbilityContextProvider;
