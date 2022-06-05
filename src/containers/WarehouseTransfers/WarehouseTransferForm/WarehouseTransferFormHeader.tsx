import React from 'react';
import classNames from 'classnames';
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
