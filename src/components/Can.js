import React from 'react';
import { Ability } from '@casl/ability';
import { createContextualCan } from '@casl/react';

import {
  Item_Abilities,
  AbilitySubject,
  Inventory_Adjustment_Abilities,
  Estimate_Abilities,
  Invoice_Abilities,
  Receipt_Abilities,
  PaymentReceive,
  Bill_Abilities,
  Payment_Made_Abilities,
  Customer_Abilities,
  Vendor_Abilities,
  Account_Abilities,
} from '../common/abilityOption';

export const AbilityContext = React.createContext();
export const Can = createContextualCan(AbilityContext.Consumer);

const AbilityContextProvider = (props) => {
  const ability = new Ability([
    {
      subject: [AbilitySubject.Account],
      action: [Account_Abilities.Create],
    },
    {
      subject: [AbilitySubject.Invoice],
      action: [],
    },
  ]);

  return (
    <AbilityContext.Provider value={ability}>
      {props.children}
    </AbilityContext.Provider>
  );
};

export default AbilityContextProvider;
