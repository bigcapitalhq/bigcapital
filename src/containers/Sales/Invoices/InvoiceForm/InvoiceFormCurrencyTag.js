import React from 'react';
import styled from 'styled-components';

import { BaseCurrency } from 'components';
import { useInvoiceFormContext } from './InvoiceFormProvider';

/**
 * Invoice form currency tag.
 */
export default function InvoiceFormCurrencyTag() {
  const { isForeignCustomer } = useInvoiceFormContext();

  if (!isForeignCustomer) {
    return null;
  }

  return (
    <BaseCurrencyTag>
      <BaseCurrency />
    </BaseCurrencyTag>
  );
}

const BaseCurrencyTag = styled.div`
  display: flex;
  align-items: center;
  font-size: 10px;
  margin-left: 4px;
  span {
    background: #5c7080;
  }
`;
