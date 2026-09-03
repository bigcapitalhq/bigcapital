// @ts-nocheck
import { MenuItem, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { Choose, T, Icon, TextStatus } from '@/components';
import { AbilitySubject, SaleEstimateAction } from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

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
    <Choose.When condition={estimate.isDelivered && estimate.isApproved}>
      <TextStatus intent={Intent.SUCCESS}>
        <T id={'approved'} />
      </TextStatus>
    </Choose.When>
    <Choose.When condition={estimate.isDelivered && estimate.isRejected}>
      <TextStatus intent={Intent.DANGER}>
        <T id={'rejected'} />
      </TextStatus>
    </Choose.When>
    <Choose.When
      condition={
        estimate.isDelivered && !estimate.isRejected && !estimate.isApproved
      }
    >
      <TextStatus intent={Intent.SUCCESS}>
        <T id={'delivered'} />
      </TextStatus>
    </Choose.When>
    <Choose.Otherwise>
      <TextStatus intent={Intent.NONE}>
        <T id={'draft'} />
      </TextStatus>
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
          <span class="bp4-text-muted">
            {item.reference.estimateNumber}{' '}
            <Icon icon={'caret-right-16'} iconSize={16} />
            {item.reference.formattedEstimateDate}
          </span>
        </div>
      }
      label={
        <>
          <div class="amount">{item.reference.formattedAmount}</div>
          <EstimateStatus estimate={item.reference} />
        </>
      }
      onClick={handleClick}
      className={'universal-search__item--estimate'}
    />
  );
}

/**
 * Transformes the estimates to search items.
 */
const transformEstimatesToSearch = (estimate) => ({
  id: estimate.id,
  text: estimate.customer?.displayName ?? '',
  label: estimate.formattedAmount ?? '',
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
