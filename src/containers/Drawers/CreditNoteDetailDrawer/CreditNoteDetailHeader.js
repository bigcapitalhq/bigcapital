import React from 'react';
import intl from 'react-intl-universal';
import { defaultTo } from 'lodash';
import clsx from 'classnames';

import { FormatDate, T, DetailsMenu, DetailItem } from 'components';
import { useCreditNoteDetailDrawerContext } from './CreditNoteDetailDrawerProvider';

import CreditNoteDetailCls from '../../../style/components/Drawers/CreditNoteDetails.module.scss';

/**
 * Credit note details drawer header.
 */
export default function CreditNoteDetailHeader() {
  const { creditNote } = useCreditNoteDetailDrawerContext();
  
  return (
    <div className={clsx(CreditNoteDetailCls.detail_panel_header)}>
      <DetailsMenu>
        <DetailItem label={intl.get('amount')}>
          <span class="big-number">{creditNote.formatted_amount}</span>
        </DetailItem>
        <DetailItem
          label={intl.get('credit_note.drawer.label_credit_note_no')}
          children={defaultTo(creditNote.credit_note_number, '-')}
        />
        <DetailItem
          label={intl.get('customer_name')}
          children={creditNote.customer?.display_name}
        />
        <DetailItem
          label={intl.get('credit_note.drawer.label_credit_note_date')}
          children={
            <FormatDate value={creditNote.formatted_credit_note_date} />
          }
        />
      </DetailsMenu>

      <DetailsMenu direction={'horizantal'} minLabelSize={'140px'}>
        <DetailItem
          label={intl.get('credit_note.drawer.label_credits_remaining')}
          children={creditNote.formatted_credits_remaining}
        />
        <DetailItem
          label={intl.get('note')}
          children={defaultTo(creditNote.note, '-')}
        />

        <DetailItem
          label={<T id={'credit_note.drawer.label_created_at'} />}
          children={<FormatDate value={creditNote.created_at} />}
        />
      </DetailsMenu>
    </div>
  );
}
