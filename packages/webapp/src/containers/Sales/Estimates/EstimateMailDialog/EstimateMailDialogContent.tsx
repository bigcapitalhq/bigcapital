import { EstimateMailDialogBoot } from './EstimateMailDialogBoot';
import { EstimateMailDialogForm } from './EstimateMailDialogForm';

interface EstimateMailDialogContentProps {
  dialogName: string;
  estimateId: number;
  redirectToEstimatesList?: boolean;
}
export default function EstimateMailDialogContent({
  dialogName,
  estimateId,
  redirectToEstimatesList,
}: EstimateMailDialogContentProps) {
  return (
    <EstimateMailDialogBoot
      estimateId={estimateId}
      redirectToEstimatesList={redirectToEstimatesList}
    >
      <EstimateMailDialogForm />
    </EstimateMailDialogBoot>
  );
}
