import React, { useMemo } from 'react';
import classNames from 'classnames';
import { sumBy } from 'lodash';
import { useFormikContext } from 'formik';

import { CLASSES } from 'common/classes';

import BillFormHeaderFields from './BillFormHeaderFields';
import { PageFormBigNumber } from 'components';
import withSettings from 'containers/Settings/withSettings';
import { compose } from 'redux';

/**
 * Fill form header.
 */
function BillFormHeader({
  onBillNumberChanged,

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
      <BillFormHeaderFields onBillNumberChanged={onBillNumberChanged} />
      <PageFormBigNumber
        label={'Due Amount'}
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
)(BillFormHeader);
