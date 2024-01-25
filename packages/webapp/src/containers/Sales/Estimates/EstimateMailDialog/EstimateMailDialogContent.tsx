import { EstimateMailDialogBoot } from './EstimateMailDialogBoot';
import { EstimateMailDialogForm } from './EstimateMailDialogForm';

interface EstimateMailDialogContentProps {
  estimateId: number;
  onFormSubmit?: () => void;
  onCancelClick?: () => void;
}
export default function EstimateMailDialogContent({
  estimateId,
  onFormSubmit,
  onCancelClick,
}: EstimateMailDialogContentProps) {
  return (
    <EstimateMailDialogBoot estimateId={estimateId}>
      <EstimateMailDialogForm
        onFormSubmit={onFormSubmit}
        onCancelClick={onCancelClick}
      />
    </EstimateMailDialogBoot>
  );
}
