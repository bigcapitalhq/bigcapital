// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { MenuItem } from '@blueprintjs/core';

import { Choose, T, Icon } from '@/components';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import { AbilitySubject, SaleEstimateAction } from '@/constants/abilityOption';

import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import { DRAWERS } from '@/constants/drawers';

/**
 * Estimate universal search item select action.
 */
function EstimateUniversalSearchSelectComponent({
  // #ownProps
  resourceType,
  resourceId,

  // #withDrawerActions
  openDrawer,
}) {
  if (resourceType === RESOURCES_TYPES.ESTIMATE) {
    openDrawer(DRAWERS.ESTIMATE_DETAILS, { estimateId: resourceId });
  }
  return null;
}

export const EstimateUniversalSearchSelect = withDrawerActions(
  EstimateUniversalSearchSelectComponent,
);

/**
 * Status accessor.
 */
export const EstimateStatus = ({ estimate }) => (
  <Choose>
    <Choose.When condition={estimate.is_delivered && estimate.is_approved}>
      <span class="approved">
        <T id={'approved'} />
      </span>
    </Choose.When>
    <Choose.When condition={estimate.is_delivered && estimate.is_rejected}>
      <span class="reject">
        <T id={'rejected'} />
      </span>
    </Choose.When>
    <Choose.When
      condition={
        estimate.is_delivered && !estimate.is_rejected && !estimate.is_approved
      }
    >
      <span class="delivered">
        <T id={'delivered'} />
      </span>
    </Choose.When>
    <Choose.Otherwise>
      <span class="draft">
        <T id={'draft'} />
      </span>
    </Choose.Otherwise>
  </Choose>
);

/**
 * Estimate universal search item.
 */
export function EstimateUniversalSearchItem(
  item,
  { handleClick, modifiers, query },
) {
  return (
    <MenuItem
      active={modifiers.active}
      text={
        <div>
          <div>{item.text}</div>
          <span class="bp3-text-muted">
            {item.reference.estimate_number}{' '}
            <Icon icon={'caret-right-16'} iconSize={16} />
            {item.reference.formatted_estimate_date}
          </span>
        </div>
      }
      label={
        <>
          <div class="amount">{item.reference.formatted_amount}</div>
          <EstimateStatus estimate={item.reference} />
        </>
      }
      onClick={handleClick}
      className={'universal-search__item--estimate'}
    />
  );
}

/**
 * Transforms the estimates to search items.
 */
const transformEstimatesToSearch = (estimate) => ({
  id: estimate.id,
  text: estimate.customer.display_name,
  label: estimate.formatted_balance,
  reference: estimate,
});

/**
 * Estimate resource universal search bind configure.
 */
export const universalSearchEstimateBind = () => ({
  resourceType: RESOURCES_TYPES.ESTIMATE,
  optionItemLabel: intl.get('estimates'),
  selectItemAction: EstimateUniversalSearchSelect,
  itemRenderer: EstimateUniversalSearchItem,
  itemSelect: transformEstimatesToSearch,
  permission: {
    ability: SaleEstimateAction.View,
    subject: AbilitySubject.Estimate,
  },
});
