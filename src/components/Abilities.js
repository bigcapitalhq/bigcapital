import { AbilityBuilder, defineAbility } from '@casl/ability';
import { createContextualCan } from '@casl/react';
import { createContext } from 'react';

export const AbilityContext = createContext();
export const Can = createContextualCan(AbilityContext.Consumer);

export const ability = defineAbility((can, cannot) => {
  cannot('Item', 'create');
});
