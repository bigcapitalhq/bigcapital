import { Intent } from '@blueprintjs/core';
import { useCallback } from 'react';
import { useGetPlaidLinkToken } from '../query';
import { useSetBankingPlaidToken } from '../state/banking';
import { AppToaster } from '@/components';

export const useOpenPlaidConnect = () => {
  const { mutateAsync: getPlaidLinkToken, isPending: isLoading } =
    useGetPlaidLinkToken();
  const setPlaidId = useSetBankingPlaidToken();

  const openPlaidAsync = useCallback(() => {
    return getPlaidLinkToken()
      .then((res) => {
        setPlaidId((res as { link_token: string }).link_token);
      })
      .catch(() => {
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
  }, [getPlaidLinkToken, setPlaidId]);

  return { openPlaidAsync, isPlaidLoading: isLoading };
};
