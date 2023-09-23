// @ts-nocheck
import React from 'react';
import { Can, Icon } from '@/components';
import { AbilitySubject, TaxRateAction } from '@/constants/abilityOption';
import { safeCallback } from '@/utils';
import { Intent, Menu, MenuDivider, MenuItem } from '@blueprintjs/core';

/**
 * Tax rates table actions menu.
 * @returns {JSX.Element}
 */
export function TaxRatesTableActionsMenu({
  payload: { onEdit, onDelete, onViewDetails, onActivate, onInactivate },
  row: { original },
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={'View Details'}
        onClick={safeCallback(onViewDetails, original)}
      />
      <Can I={TaxRateAction.Edit} a={AbilitySubject.TaxRate}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={'Edit Tax Rate'}
          onClick={safeCallback(onEdit, original)}
        />
      </Can>
      <MenuDivider />
      {!original.active && (
        <MenuItem
          icon={<Icon icon="play-16" iconSize={16} />}
          text={'Activate Tax Rate'}
          onClick={safeCallback(onActivate, original)}
        />
      )}
      {!!original.active && (
        <MenuItem
          icon={<Icon icon="pause-16" iconSize={16} />}
          text={'Inactivate Tax Rate'}
          onClick={safeCallback(onInactivate, original)}
        />
      )}
      <Can I={TaxRateAction.Delete} a={AbilitySubject.TaxRate}>
        <MenuDivider />
        <MenuItem
          text={'Delete Tax Rate'}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Can>
    </Menu>
  );
}
