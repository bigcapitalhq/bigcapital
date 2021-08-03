import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';

import { CLASSES } from 'common/classes';
import { PageFormBigNumber } from 'components';
import ReceiptFormHeaderFields from './ReceiptFormHeaderFields';

import withSettings from 'containers/Settings/withSettings';

import { getEntriesTotal } from 'containers/Entries/utils';
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
    () => getEntriesTotal(values.entries),
    [values.entries],
  );

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <ReceiptFormHeaderFields
        onReceiptNumberChanged={onReceiptNumberChanged}
      />
      <PageFormBigNumber
        label={intl.get('due_amount')}
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
