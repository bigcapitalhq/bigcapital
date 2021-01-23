import React, { useMemo, useCallback, useState } from 'react';
import { MenuItem, Button } from '@blueprintjs/core';
import { omit } from 'lodash';
import MultiSelect from 'components/MultiSelect';
import { FormattedMessage as T } from 'react-intl';

export default function CustomersMultiSelect({
  customers,
  defaultText = <T id={'all_customers'} />,
  buttonProps,

  onCustomerSelected,
  ...selectProps
}) {
  const [selectedCustomers, setSelectedCustomers] = useState({});

  const isCustomerSelect = useCallback(
    (id) => typeof selectedCustomers[id] !== 'undefined',
    [selectedCustomers],
  );

  const customerRenderer = useCallback(
    (customer, { handleClick }) => (
      <MenuItem
        icon={isCustomerSelect(customer.id) ? 'tick' : 'blank'}
        text={customer.display_name}
        key={customer.id}
        onClick={handleClick}
      />
    ),
    [isCustomerSelect],
  );

  const countSelected = useMemo(() => Object.values(selectedCustomers).length, [
    selectedCustomers,
  ]);

  const onContactSelect = useCallback(
    ({ id }) => {
      const selected = {
        ...(isCustomerSelect(id)
          ? {
              ...omit(selectedCustomers, [id]),
            }
          : {
              ...selectedCustomers,
              [id]: true,
            }),
      };
      setSelectedCustomers({ ...selected });
      onCustomerSelected && onCustomerSelected(selected);
    },
    [
      setSelectedCustomers,
      selectedCustomers,
      isCustomerSelect,
      onCustomerSelected,
    ],
  );

  return (
    <MultiSelect
      items={customers}
      noResults={<MenuItem disabled={true} text="No results." />}
      itemRenderer={customerRenderer}
      popoverProps={{ minimal: true }}
      filterable={true}
      onItemSelect={onContactSelect}
    >
      <Button
        text={
          countSelected === 0 ? (
            defaultText
          ) : (
            <T id={'selected_customers'} values={{ count: countSelected }} />
          )
        }
        {...buttonProps}
      />
    </MultiSelect>
  );
}
