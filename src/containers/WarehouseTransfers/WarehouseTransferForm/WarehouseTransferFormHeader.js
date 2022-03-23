import React from 'react';
import classNames from 'classnames';
import { useFormikContext  } from 'formik';
import intl from 'react-intl-universal';
import { CLASSES } from 'common/classes';

import WarehouseTransferFormHeaderFields from './WarehouseTransferFormHeaderFields';

/**
 * Warehose transfer form header section.
 */
function WarehouseTransferFormHeader() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <WarehouseTransferFormHeaderFields />
    </div>
  );
}

export default WarehouseTransferFormHeader;
