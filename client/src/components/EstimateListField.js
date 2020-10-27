import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { MenuItem } from '@blueprintjs/core';
import ListSelect from 'components/ListSelect';

function EstimateListField({
  products,
  initialProductId,
  selectedProductId,
  defautlSelectText = 'Click to select an item.',
  onProductSelected,
}) {
  const initialProduct = useMemo(
    () => products.find((a) => a.id === initialProductId),
    [initialProductId],
  );

  const [selectedProduct, setSelectedProduct] = useState(
    initialProduct || null,
  );

  useEffect(() => {
    if (typeof selectedProductId !== 'undefined') {
      const product = selectedProductId
        ? products.find((a) => a.id === selectedProductId)
        : null;
      setSelectedProduct(product);
    }
  }, [selectedProductId, products, setSelectedProduct]);

  const onProductSelect = useCallback(
    (product) => {
      setSelectedProduct({ ...product });
      onProductSelected && onProductSelected(product);
    },
    [onProductSelected],
  );

  const productRenderer = useCallback(
    (item, { handleClick }) => (
      <MenuItem key={item.id} text={item.name} onClick={handleClick} />
    ),
    [],
  );

  const filterProduct = useCallback((query, product, _index, exactMatch) => {
    const normalizedTitle = product.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return normalizedTitle.indexOf(normalizedQuery) >= 0;
    }
  }, []);

  return (
    <ListSelect
      items={products}
      noResults={<MenuItem disabled={true} text="No results." />}
      itemRenderer={productRenderer}
      itemPredicate={filterProduct}
      popoverProps={{ minimal: true }}
      onItemSelect={onProductSelect}
      selectedItem={`${selectedProductId}`}
      selectedItemProp={'id'}
      labelProp={'name'}
      defaultText={selectedProduct ? selectedProduct.name : defautlSelectText}
    />
  );
}

export default EstimateListField;
