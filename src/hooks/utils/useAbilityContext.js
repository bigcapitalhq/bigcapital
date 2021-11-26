import { useAbility } from '@casl/react';
import { AbilityContext } from '../../components';

export const useAbilityContext = () => useAbility(AbilityContext);