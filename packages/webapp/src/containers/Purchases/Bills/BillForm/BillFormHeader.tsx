// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import { PageFormBigNumber } from '@/components';

import BillFormHeaderFields from './BillFormHeaderFields';
import { useBillTotalFormatted } from './utils';

/**
 * Fill form header.
 */
function BillFormHeader() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <BillFormHeaderFields />
      <BillFormBigTotal />
    </div>
  );
}

function BillFormBigTotal() {
  const totalFormatted = useBillTotalFormatted();

  return (
    <PageFormBigNumber label={intl.get('due_amount')} amount={totalFormatted} />
  );
}

export default BillFormHeader;
