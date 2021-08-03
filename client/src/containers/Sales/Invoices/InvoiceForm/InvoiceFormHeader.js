import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';

import { CLASSES } from 'common/classes';
import InvoiceFormHeaderFields from './InvoiceFormHeaderFields';

import { getEntriesTotal } from 'containers/Entries/utils';
import { PageFormBigNumber } from 'components';

import withSettings from 'containers/Settings/withSettings';

import { compose } from 'redux';

/**
 * Invoice form header section.
 */
function InvoiceFormHeader({
  // #withSettings
  baseCurrency,
}) {
  const { values } = useFormikContext();

  // Calculate the total due amount of invoice entries.
  const totalDueAmount = useMemo(
    () => getEntriesTotal(values.entries),
    [values.entries],
  );

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <InvoiceFormHeaderFields />
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
)(InvoiceFormHeader);
