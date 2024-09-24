import React from 'react';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSetStripeAccountCallback } from '@/hooks/query/stripe-integration';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function PreferencesStripeCallback() {
  const query = useQuery();
  const code = query.get('code') as string;
  const { mutateAsync: stripeAccountCallback } = useSetStripeAccountCallback();

  const history = useHistory();

  useEffect(() => {
    stripeAccountCallback({ code }).then(() => {
      history.push('/preferences/payment-methods')
    });
  }, [history, stripeAccountCallback, code]);

  return null;
}
