import { css } from '@emotion/css';
import { useParams } from 'react-router-dom';
import { EstimateForm } from './EstimateForm';
import {
  EstimateFormProvider,
  useEstimateFormContext,
} from './EstimateFormProvider';
import { DashboardInsider } from '@/components';
import { AutoExchangeRateProvider } from '@/containers/Entries/AutoExchangeProvider';

/**
 * Estimate form page.
 */
export function EstimateFormPage() {
  const { id } = useParams<{ id?: string }>();
  const idInteger = id ? parseInt(id, 10) : undefined;

  return (
    <EstimateFormProvider estimateId={idInteger}>
      <AutoExchangeRateProvider>
        <EstimateFormPageContent />
      </AutoExchangeRateProvider>
    </EstimateFormProvider>
  );
}

export function EstimateFormPageContent() {
  const { isBootLoading } = useEstimateFormContext();

  return (
    <DashboardInsider
      loading={isBootLoading}
      className={css`
        min-height: calc(100vh - var(--top-offset));
        max-height: calc(100vh - var(--top-offset));
      `}
    >
      <EstimateForm />
    </DashboardInsider>
  );
}
