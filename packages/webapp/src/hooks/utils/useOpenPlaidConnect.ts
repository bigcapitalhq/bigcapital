import { useCallback } from 'react';
import { useSetBankingPlaidToken } from '../state/banking';
import { AppToaster } from '@/components';
import { useGetPlaidLinkToken } from '../query';
import { Intent } from '@blueprintjs/core';

export const useOpenPlaidConnect = () => {
  const { mutateAsync: getPlaidLinkToken, isLoading } = useGetPlaidLinkToken();
  const setPlaidId = useSetBankingPlaidToken();

  const openPlaidAsync = useCallback(() => {
    return getPlaidLinkToken()
      .then((res) => {
        setPlaidId(res.data.link_token);
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
