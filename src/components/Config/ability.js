import { AbilityBuilder } from '@casl/ability';
// import { AbilitySubject, ItemAbility } from '../../common/abilityOption';

export function defineAbilitiesFor(role) {
  const { rules, can } = new AbilityBuilder();

  can('create', 'Item');

  return new Ability(rules);
}
