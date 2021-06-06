import React, { useMemo } from 'react';
import classNames from 'classnames';
import { sumBy } from 'lodash';
import { useFormikContext } from 'formik';
import { formatMessage } from 'services/intl';

import { CLASSES } from 'common/classes';
import InvoiceFormHeaderFields from './InvoiceFormHeaderFields';

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
    () => sumBy(values.entries, 'total'),
    [values.entries],
  );

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <InvoiceFormHeaderFields />
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
)(InvoiceFormHeader);
