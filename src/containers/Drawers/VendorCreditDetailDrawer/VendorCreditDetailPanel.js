import React from 'react';
import clsx from 'classnames';

import { Card } from 'components';

import VendorCreditDetailActionsBar from './VendorCreditDetailActionsBar';
import VendorCreditDetailHeader from './VendorCreditDetailHeader';
import VendorCreditDetailTable from './VendorCreditDetailTable';
import VendorCreditDetailDrawerFooter from './VendorCreditDetailDrawerFooter';

import VendorCreditDetailCls from '../../../style/components/Drawers/VendorCreditDetail.module.scss';

export default function VendorCreditDetailPanel() {
  return (
    <div className={clsx(VendorCreditDetailCls.detail_panel)}>
      <VendorCreditDetailActionsBar />
      <Card>
        <VendorCreditDetailHeader />
        <VendorCreditDetailTable />
        <VendorCreditDetailDrawerFooter />
      </Card>
    </div>
  );
}
