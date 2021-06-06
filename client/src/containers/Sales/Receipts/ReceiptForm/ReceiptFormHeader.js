import React, { useMemo } from 'react';
import classNames from 'classnames';
import { sumBy } from 'lodash';
import { useFormikContext } from 'formik';

import { CLASSES } from 'common/classes';
import ReceiptFormHeaderFields from './ReceiptFormHeaderFields';

import { PageFormBigNumber } from 'components';
import { formatMessage } from 'services/intl';

import withSettings from 'containers/Settings/withSettings';
import { compose } from 'redux';

/**
 * Receipt form header section.
 */
function ReceiptFormHeader({
  // #ownProps
  onReceiptNumberChanged,
  // #withSettings
  baseCurrency,
}) {
  const { values } = useFormikContext();

  // Calculate the total due amount of bill entries.
  const totalDueAmount = useMemo(
    () => sumBy(values.entries, 'total'),
    [values.entries],
  );

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <ReceiptFormHeaderFields
        onReceiptNumberChanged={onReceiptNumberChanged}
      />
      <PageFormBigNumber
        label={formatMessage({ id: 'due_amount' })}
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
)(ReceiptFormHeader);
