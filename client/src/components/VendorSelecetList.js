import React, { useCallback } from 'react';
import { FormattedMessage as T } from 'react-intl';
import { ListSelect } from 'components';
import { MenuItem } from '@blueprintjs/core';

export default function VendorSelecetList({
  vendorsList,
  selectedVendorId,
  defaultSelectText = <T id={'select_vender_account'} />,
  onVenderSelected,
  // disabled = false,
  ...restProps
}) {
  // Filter Vendors List
  const FilterVendors = (query, vender, index, exactMatch) => {
    const normalizedTitle = vender.display_name.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return (
        `${vender.display_name} ${normalizedTitle}`.indexOf(normalizedQuery) >=
        0
      );
    }
  };

  const handleVendorSelected = useCallback(
    (Vendor) => onVenderSelected && onVenderSelected(Vendor),
    [],
  );

  const handleVenderRenderer = useCallback(
    (vender, { handleClick }) => (
      <MenuItem
        key={vender.id}
        text={vender.display_name}
        onClick={handleClick}
      />
    ),
    [],
  );

  return (
    <ListSelect
      items={vendorsList}
      selectedItemProp={'id'}
      selectedItem={selectedVendorId}
      labelProp={'display_name'}
      defaultText={defaultSelectText}
      onItemSelect={handleVendorSelected}
      itemPredicate={FilterVendors}
      itemRenderer={handleVenderRenderer}
      popoverProps={{ minimal: true }}
      {...restProps}
    />
  );
}
