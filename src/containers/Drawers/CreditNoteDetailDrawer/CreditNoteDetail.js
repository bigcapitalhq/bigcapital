import React from 'react';
import { Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { DrawerMainTabs } from 'components';

import CreditNoteDetailPanel from './CreditNoteDetailPanel';
import clsx from 'classnames';

import CreditNoteDetailCls from '../../../style/components/Drawers/CreditNoteDetails.module.scss';

/**
 * Credit Note view detail.
 */
export default function CreditNoteDetail() {
  return (
    <div className={clsx(CreditNoteDetailCls.root)}>
      <DrawerMainTabs>
        <Tab
          title={intl.get('details')}
          id={'details'}
          panel={<CreditNoteDetailPanel />}
        />
      </DrawerMainTabs>
    </div>
  );
}
