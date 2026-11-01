import { EstimateDetail } from './EstimateDetail';
import { EstimateDetailDrawerProvider } from './EstimateDetailDrawerProvider';
import { DrawerBody } from '@/components';

interface EstimateDetailDrawerContentProps {
  estimateId: number | undefined;
}

/**
 * Estimate detail drawer content.
 */
export function EstimateDetailDrawerContent({
  estimateId,
}: EstimateDetailDrawerContentProps) {
  return (
    <EstimateDetailDrawerProvider estimateId={estimateId}>
      <DrawerBody>
        <EstimateDetail />
      </DrawerBody>
    </EstimateDetailDrawerProvider>
  );
}
