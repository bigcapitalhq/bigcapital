import React from 'react';
import intl from 'react-intl-universal';
import {
  Alignment,
  Navbar,
  NavbarGroup,
  Button,
  Classes,
} from '@blueprintjs/core';
import styled from 'styled-components';
import { useSetPrimaryBranchToForm } from './utils';
import { useFeatureCan } from 'hooks/state';
import { Icon, BranchSelect, FeatureCan } from 'components';
import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';
import { Features } from 'common';

/**
 * Payment receive from top bar.
 * @returns
 */
export default function PaymentReceiveFormTopBar() {
  // Features guard.
  const { featureCan } = useFeatureCan();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();

  // Can't display the navigation bar if  branches feature is not enabled.
  if (!featureCan(Features.Branches)) {
    return null;
  }

  return (
    <Navbar className={'navbar--dashboard-topbar'}>
      <NavbarGroup align={Alignment.LEFT}>
        <FeatureCan feature={Features.Branches}>
          <PaymentReceiveFormSelectBranch />
        </FeatureCan>
      </NavbarGroup>
    </Navbar>
  );
}

function PaymentReceiveFormSelectBranch() {
  // payment receive form context.
  const { branches, isBranchesLoading } = usePaymentReceiveFormContext();

  return isBranchesLoading ? (
    <DetailsBarSkeletonBase className={Classes.SKELETON} />
  ) : (
    <BranchSelect
      name={'branch_id'}
      branches={branches}
      input={PaymentReceiveBranchSelectButton}
      popoverProps={{ minimal: true }}
    />
  );
}

function PaymentReceiveBranchSelectButton({ label }) {
  return (
    <Button
      text={intl.get('invoice.branch_button.label', { label })}
      minimal={true}
      small={true}
      icon={<Icon icon={'branch-16'} iconSize={16} />}
    />
  );
}

const DetailsBarSkeletonBase = styled.div`
  letter-spacing: 10px;
  margin-right: 10px;
  margin-left: 10px;
  font-size: 8px;
  width: 140px;
  height: 10px;
`;
