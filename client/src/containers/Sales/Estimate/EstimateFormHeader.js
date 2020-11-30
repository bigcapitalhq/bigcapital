import React, { useMemo } from 'react';
import { compose } from 'utils';
import classNames from 'classnames';
import { sumBy } from 'lodash';
import { useFormikContext } from 'formik';

import { CLASSES } from 'common/classes';

import { PageFormBigNumber } from 'components';

import withCustomers from 'containers/Customers/withCustomers';
import withDialogActions from 'containers/Dialog/withDialogActions';

import EstimateFormHeaderFields from './EstimateFormHeaderFields';

// Estimate form top header.
function EstimateFormHeader({
  // #ownProps
  onEstimateNumberChanged,
}) {
  const { values } = useFormikContext();

  // Calculate the total due amount of bill entries.
  const totalDueAmount = useMemo(() => sumBy(values.entries, 'total'), [
    values.entries,
  ]);

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <EstimateFormHeaderFields
        onEstimateNumberChanged={onEstimateNumberChanged}
      />
      <PageFormBigNumber
        label={'Amount'}
        amount={totalDueAmount}
        currencyCode={'LYD'}
      />
    </div>
  );
}

export default compose(
  withCustomers(({ customers }) => ({
    customers,
  })),
  withDialogActions,
)(EstimateFormHeader);
