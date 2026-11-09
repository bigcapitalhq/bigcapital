import classNames from 'classnames';
import React from 'react';
import { WarehouseTransferFormHeaderFields } from './WarehouseTransferFormHeaderFields';
import { CLASSES } from '@/constants/classes';

/**
 * Warehose transfer form header section.
 */
export function WarehouseTransferFormHeader() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <WarehouseTransferFormHeaderFields />
    </div>
  );
}
