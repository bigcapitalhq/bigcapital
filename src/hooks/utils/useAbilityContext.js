import React from 'react';
import { useAbility } from '@casl/react';
import { AbilityContext } from '../../components/Can';

export const useAbilityContext = () => useAbility(AbilityContext);

