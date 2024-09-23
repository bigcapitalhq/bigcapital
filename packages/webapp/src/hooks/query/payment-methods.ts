// @ts-nocheck
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from 'react-query';
import useApiRequest from '../useRequest';



// # Edit payment method
// -----------------------------------------
interface EditPaymentMethodValues {
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
interface EditPaymentMethodResponse {
  id: number;
  message: string;
}
export const useEditPaymentMethod = (
  options?: UseMutationOptions<
    EditPaymentMethodResponse,
    Error,
    EditPaymentMethodValues
  >,
): UseMutationResult<
  EditPaymentMethodResponse,
  Error,
  EditPaymentMethodValues
> => {
  const apiRequest = useApiRequest();

  return useMutation<EditPaymentMethodResponse, Error, EditPaymentMethodValues>(
    ({ paymentMethodId, ...editData }) => {
      return apiRequest
        .put(`/payment-methods/${paymentMethodId}`, editData)
        .then((res) => res.data);
    },
    { ...options },
  );
};
