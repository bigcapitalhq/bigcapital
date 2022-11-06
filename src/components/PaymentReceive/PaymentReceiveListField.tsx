// @ts-nocheck
import React, { useCallback } from 'react';
import { MenuItem } from '@blueprintjs/core';
import { ListSelect, FormattedMessage as T } from '@/components';

export function PaymentReceiveListField({
  invoices,
  selectedInvoiceId,
  onInvoiceSelected,
  defaultSelectText = <T id={'select_invoice'} />,
}) {
  const onInvoiceSelect = useCallback((_invoice) => {
    onInvoiceSelected && onInvoiceSelected(_invoice);
  });

  const handleInvoiceRenderer = useCallback(
    (item, { handleClick }) => (
      <MenuItem id={item.id} name={item.name} onClick={handleClick} />
    ),
    [],
  );

  return (
    <ListSelect
      item={invoices}
      noResults={<MenuItem disabled={true} text={<T id={'no_results'} />} />}
      itemRenderer={handleInvoiceRenderer}
      popoverProps={{ minimal: true }}
      onItemSelect={onInvoiceSelect}
      selectedItem={`${selectedInvoiceId}`}
      selectedItemProp={'id'}
      textProp={'name'}
      defaultText={defaultSelectText}
    />
  );
}
