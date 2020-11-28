import React from 'react';
import { compose } from 'utils';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';

import { PageFormBigNumber } from 'components';

import withCustomers from 'containers/Customers/withCustomers';
import withDialogActions from 'containers/Dialog/withDialogActions';

import EstimateFormHeaderFields from './EstimateFormHeaderFields';

function EstimateFormHeader({
  // #ownProps
  onEstimateNumberChanged,
}) {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <EstimateFormHeaderFields
        onEstimateNumberChanged={onEstimateNumberChanged}
      />

      <PageFormBigNumber label={'Amount'} amount={0} currencyCode={'LYD'} />
    </div>
  );
}

export default compose(
  withCustomers(({ customers }) => ({
    customers,
  })),
  withDialogActions,
)(EstimateFormHeader);
