import React, { useMemo } from 'react';
import 'style/components/Skeleton.scss';

import { randomNumber } from 'utils';

/**
 * Skeleton component.
 */
export default function Skeleton({
  Tag = 'span',
  minWidth = 40,
  maxWidth = 100,
}) {
  const randomWidth = useMemo(() => randomNumber(minWidth, maxWidth), [
    minWidth,
    maxWidth,
  ]);
  return <Tag className={'skeleton'} style={{ width: `${randomWidth}%` }} />;
}
