import React from 'react';
import { Ability } from '@casl/ability';
import { createContextualCan } from '@casl/react';

import {
  ItemAbility,
  AbilitySubject,
  InventoryAdjustment,
} from '../common/abilityOption';

export const AbilityContext = React.createContext();
export const Can = createContextualCan(AbilityContext.Consumer);

const AbilityContextProvider = (props) => {
  const ability = new Ability([
    {
      subject: [AbilitySubject.Item],
      action: [ItemAbility.Create, ItemAbility.Edit],
    },
  ]);

  return (
    <AbilityContext.Provider value={ability}>
      {props.children}
    </AbilityContext.Provider>
  );
};

export default AbilityContextProvider;
