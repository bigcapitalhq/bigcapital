import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { MenuItem, Button } from '@blueprintjs/core';
import ListSelect from 'components/ListSelect';
import { FormattedMessage as T } from 'react-intl';

function EstimateListField({
  products,
  selectedProductId,
  onProductSelected,
  defautlSelectText = <T id={'select_product'} />,
}) {
  const onProductSelect = useCallback(
    (product) => {
      onProductSelected && onProductSelected(product);
    },
    [onProductSelected],
  );

  const productRenderer = useCallback(
    (item, { handleClick, modifiers, query }) => (
      <MenuItem text={item.name} key={item.id} onClick={handleClick} />
    ),
    [],
  );

  return (
    <ListSelect
      items={products}
      noResults={<MenuItem disabled={true} text="No results." />}
      itemRenderer={productRenderer}
      popoverProps={{ minimal: true }}
      onItemSelect={onProductSelect}
      selectedItem={`${selectedProductId}`}
      selectedItemProp={'id'}
      labelProp={'name'}
      defaultText={defautlSelectText}
    />
  );
}

export default EstimateListField;
