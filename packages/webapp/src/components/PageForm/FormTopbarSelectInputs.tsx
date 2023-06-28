// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Button } from '@blueprintjs/core';
import { Icon } from '@/components';

export function FormWarehouseSelectButton({ text }) {
  return (
    <Button
      text={intl.get('page_form.warehouse_button.label', { text })}
      minimal={true}
      small={true}
      icon={<Icon icon={'warehouse-16'} iconSize={16} />}
    />
  );
}

export function FormBranchSelectButton({ text }) {
  return (
    <Button
      text={intl.get('page_form.branch_button.label', { text })}
      minimal={true}
      small={true}
      icon={<Icon icon={'branch-16'} iconSize={16} />}
    />
  );
}
