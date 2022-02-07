import React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';

import { CurrencyTag } from 'components';
import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';

/**
 * base currency sign.
 */
function BaseCurrency({
  // #withCurrentOrganization
  organization: { base_currency = '' },
}) {
  // if (base_currency.length <= 0) {
  //   return null;
  // }

  return (
    <BaseCurrencySign>
      <CurrencyTag>{base_currency}</CurrencyTag>
    </BaseCurrencySign>
  );
}

export default R.compose(withCurrentOrganization())(BaseCurrency);

const BaseCurrencySign = styled.div`
  font-size: 10px;
  margin-left: 5px;
  span {
    background: #5c7080;
  }
`;
