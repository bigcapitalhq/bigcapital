import {
  fetchUpdatePaymentMethod,
  type UpdatePaymentMethodBody,
  type UpdatePaymentMethodResponse,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';

export interface EditPaymentMethodValues {
  paymentMethodId: number;
  name?: string;
  bankAccountId?: number;
  clearningAccountId?: number;
  showVisa?: boolean;
  showMasterCard?: boolean;
  showDiscover?: boolean;
  showAmer?: boolean;
  showJcb?: boolean;
  showDiners?: boolean;
}

/**
 * Edits a payment method.
 */
export const useEditPaymentMethod = (
  options?: UseMutationOptions<
    UpdatePaymentMethodResponse,
    Error,
    EditPaymentMethodValues
  >,
): UseMutationResult<
  UpdatePaymentMethodResponse,
  Error,
  EditPaymentMethodValues
> => {
  const fetcher = useApiFetcher();

  return useMutation<
    UpdatePaymentMethodResponse,
    Error,
    EditPaymentMethodValues
  >({
    mutationFn: ({ paymentMethodId, ...editData }) => {
      const body: UpdatePaymentMethodBody = {
        name: editData.name,
        options: {
          bankAccountId: editData.bankAccountId,
          clearningAccountId: editData.clearningAccountId,
          showVisa: editData.showVisa,
          showMasterCard: editData.showMasterCard,
          showDiscover: editData.showDiscover,
          showAmer: editData.showAmer,
          showJcb: editData.showJcb,
          showDiners: editData.showDiners,
        },
      };
      return fetchUpdatePaymentMethod(fetcher, paymentMethodId, body);
    },
    ...options,
  });
};
