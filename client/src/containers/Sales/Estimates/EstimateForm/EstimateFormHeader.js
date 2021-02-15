import React, { useMemo } from 'react';
import classNames from 'classnames';
import { sumBy } from 'lodash';
import { useFormikContext } from 'formik';

import { CLASSES } from 'common/classes';

import EstimateFormHeaderFields from './EstimateFormHeaderFields';
import { PageFormBigNumber } from 'components';
import withSettings from 'containers/Settings/withSettings';
import { compose } from 'utils';

// Estimate form top header.
function EstimateFormHeader({
  // #withSettings
  baseCurrency,
}) {
  const { values } = useFormikContext();

  // Calculate the total due amount of bill entries.
  const totalDueAmount = useMemo(() => sumBy(values.entries, 'total'), [
    values.entries,
  ]);

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <EstimateFormHeaderFields />
      <PageFormBigNumber
        label={'Amount'}
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
