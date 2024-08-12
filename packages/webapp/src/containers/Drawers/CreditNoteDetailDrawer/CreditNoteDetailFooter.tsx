// @ts-nocheck
import React from 'react';
import {
  CommercialDocFooter,
  T,
  If,
  DetailsMenu,
  DetailItem,
} from '@/components';

import { useCreditNoteDetailDrawerContext } from './CreditNoteDetailDrawerProvider';

/**
 * Credit note detail footer
 * @returns {React.JSX}
 */
export default function CreditNoteDetailFooter() {
  const { creditNote } = useCreditNoteDetailDrawerContext();

  return (
    <CommercialDocFooter>
      <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
        <If condition={creditNote.terms_conditions}>
          <DetailItem
            label={<T id={'note'} />}
            children={creditNote.note}
            multiline
          />
        </If>

        <If condition={creditNote.terms_conditions}>
          <DetailItem label={<T id={'terms_conditions'} />} multiline>
            {creditNote.terms_conditions}
          </DetailItem>
        </If>
      </DetailsMenu>
    </CommercialDocFooter>
  );
}
