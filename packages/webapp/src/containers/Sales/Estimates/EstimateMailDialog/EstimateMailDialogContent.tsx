import { EstimateMailDialogBoot } from './EstimateMailDialogBoot';
import { EstimateMailDialogForm } from './EstimateMailDialogForm';

interface EstimateMailDialogContentProps {
  dialogName: string;
  estimateId: number;
}
export default function EstimateMailDialogContent({
  dialogName,
  estimateId,
}: EstimateMailDialogContentProps) {
  return (
    <EstimateMailDialogBoot estimateId={estimateId}>
      <EstimateMailDialogForm /> 
    </EstimateMailDialogBoot>
  )
}
