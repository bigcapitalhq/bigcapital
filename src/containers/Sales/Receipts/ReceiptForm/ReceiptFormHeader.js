import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';

import { CLASSES } from 'common/classes';
import { PageFormBigNumber } from 'components';
import ReceiptFormHeaderFields from './ReceiptFormHeaderFields';

import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';

import { getEntriesTotal } from 'containers/Entries/utils';
import { compose } from 'redux';

/**
 * Receipt form header section.
 */
function ReceiptFormHeader({
  // #ownProps
  onReceiptNumberChanged,
  // #withCurrentOrganization
  organization: { base_currency },
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
        currencyCode={base_currency}
      />
    </div>
  );
}

export default compose(withCurrentOrganization())(ReceiptFormHeader);
