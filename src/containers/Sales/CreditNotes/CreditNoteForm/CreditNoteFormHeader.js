import React from 'react';
import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import CreditNoteFormHeaderFields from './CreditNoteFormHeaderFields';

import { getEntriesTotal } from 'containers/Entries/utils';
import { PageFormBigNumber } from 'components';

import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';

import { compose } from 'utils';

/**
 * Credit note header.
 */
function CreditNoteFormHeader({
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
      <CreditNoteFormHeaderFields />
      <PageFormBigNumber
        label={intl.get('due_amount')}
        amount={totalAmount}
        currencyCode={base_currency}
      />
    </div>
  );
}

export default compose(withCurrentOrganization())(CreditNoteFormHeader);
