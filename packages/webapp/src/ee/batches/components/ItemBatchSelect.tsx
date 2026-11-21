import { HTMLSelect } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { useItemBatches } from '../hooks/query';

interface ItemBatchSelectProps {
  itemId: number;
  batchId?: number | null;
  onChange: (batchId: number | null) => void;
}

export function ItemBatchSelect({
  itemId,
  batchId,
  onChange,
}: ItemBatchSelectProps) {
  const { data, isLoading } = useItemBatches(itemId);
  return (
    <HTMLSelect
      aria-label={intl.get('batch.select.title')}
      value={batchId ?? ''}
      disabled={isLoading}
      onChange={(event) => onChange(Number(event.target.value) || null)}
      fill
    >
      <option value="">{intl.get('batch.select.placeholder')}</option>
      {data?.results.map((batch) => (
        <option key={batch.id} value={batch.id}>
          {batch.batchNumber}
        </option>
      ))}
    </HTMLSelect>
  );
}
