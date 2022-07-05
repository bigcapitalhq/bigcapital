import React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { CurrencyTag } from '@/components';

import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

/**
 * base currecncy.
 */
function BaseCurrency({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  return <CurrencyTag>{base_currency}</CurrencyTag>;
}

export default R.compose(withCurrentOrganization())(BaseCurrency);
