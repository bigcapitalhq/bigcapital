import React from 'react';
import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import VendorCreditNoteFormHeaderFields from './VendorCreditNoteFormHeaderFields';

import { getEntriesTotal } from 'containers/Entries/utils';
import { PageFormBigNumber } from 'components';

import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';

import { compose } from 'utils';

/**
 * Vendor Credit note header.
 */
function VendorCreditNoteFormHeader({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const { values } = useFormikContext();

  // Calculate the total amount.
  const totalAmount = React.useMemo(
    () => getEntriesTotal(values.entries),
    [values.entries],
  );

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <VendorCreditNoteFormHeaderFields />
      <PageFormBigNumber
        label={intl.get('vendor_credits.label.amount_to_credit')}
        amount={totalAmount}
        currencyCode={base_currency}
      />
    </div>
  );
}

export default compose(withCurrentOrganization())(VendorCreditNoteFormHeader);
