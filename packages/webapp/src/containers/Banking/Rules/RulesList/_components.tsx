import { Intent, Menu, MenuDivider, MenuItem } from '@blueprintjs/core';
import React from 'react';
import type { BankRuleTableRow } from './hooks';
import { Can, Icon } from '@/components';
import { AbilitySubject, BankRuleAction } from '@/constants/abilityOption';
import { safeCallback } from '@/utils';

interface BankRulesTableActionsMenuPayload {
  onEdit: (rule: BankRuleTableRow) => void;
  onDelete: (rule: BankRuleTableRow) => void;
}

interface BankRulesTableActionsMenuProps {
  payload: BankRulesTableActionsMenuPayload;
  row: { original: BankRuleTableRow };
}

/**
 * Tax rates table actions menu.
 * @returns {JSX.Element}
 */
export function BankRulesTableActionsMenu({
  payload: { onEdit, onDelete },
  row: { original },
}: BankRulesTableActionsMenuProps) {
  return (
    <Menu>
      <Can I={BankRuleAction.Edit} a={AbilitySubject.BankRule}>
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={'Edit Rule'}
          onClick={safeCallback(onEdit, original)}
        />
      </Can>
      <Can I={BankRuleAction.Delete} a={AbilitySubject.BankRule}>
        <MenuDivider />
        <MenuItem
          text={'Delete Rule'}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Can>
    </Menu>
  );
}
