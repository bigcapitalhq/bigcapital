import React, { useMemo } from 'react';
import classNames from 'classnames';
import { sumBy } from 'lodash';
import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';

import { CLASSES } from 'common/classes';

import BillFormHeaderFields from './BillFormHeaderFields';
import { PageFormBigNumber } from 'components';
import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';

import { compose } from 'redux';

/**
 * Fill form header.
 */
function BillFormHeader({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const { values } = useFormikContext();

  // Calculate the total due amount of bill entries.
  const totalDueAmount = useMemo(
    () => sumBy(values.entries, 'amount'),
    [values.entries],
  );

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <BillFormHeaderFields />
      <PageFormBigNumber
        label={intl.get('due_amount')}
        amount={totalDueAmount}
        currencyCode={base_currency}
      />
    </div>
  );
}
export default compose(withCurrentOrganization())(BillFormHeader);
