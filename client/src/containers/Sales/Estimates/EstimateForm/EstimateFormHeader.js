import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';

import { CLASSES } from 'common/classes';
import EstimateFormHeaderFields from './EstimateFormHeaderFields';

import withSettings from 'containers/Settings/withSettings';

import { getEntriesTotal } from 'containers/Entries/utils';
import { PageFormBigNumber } from 'components';
import { compose } from 'utils';

// Estimate form top header.
function EstimateFormHeader({
  // #withSettings
  baseCurrency,
}) {
  const { values } = useFormikContext();

  // Calculate the total due amount of bill entries.
  const totalDueAmount = useMemo(
    () => getEntriesTotal(values.entries),
    [values.entries],
  );

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <EstimateFormHeaderFields />

      <PageFormBigNumber
        label={intl.get('amount')}
        amount={totalDueAmount}
        currencyCode={baseCurrency}
      />
    </div>
  );
}

export default compose(
  withSettings(({ organizationSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
  })),
)(EstimateFormHeader);
