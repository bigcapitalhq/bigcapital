import { Tag } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { BatchStatus } from '@/ee/batches/hooks/query/queries';

const STATUS_INTENT: Record<
  BatchStatus,
  'success' | 'warning' | 'danger' | 'none'
> = {
  active: 'success',
  expiring_soon: 'warning',
  expired: 'danger',
  depleted: 'none',
};

interface BatchStatusTagProps {
  status: BatchStatus;
  minimal?: boolean;
}

/**
 * Batch status tag.
 */
export function BatchStatusTag({
  status,
  minimal = true,
}: BatchStatusTagProps) {
  return (
    <Tag
      minimal={minimal}
      intent={STATUS_INTENT[status] ?? 'none'}
      round={true}
    >
      {intl.get(`batch.status.${status}`)}
    </Tag>
  );
}
