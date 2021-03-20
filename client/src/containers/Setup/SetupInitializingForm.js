import React, { useEffect } from 'react';
import { ProgressBar, Intent } from '@blueprintjs/core';
import { useBuildTenant } from 'hooks/query';

import 'style/pages/Setup/Initializing.scss';

/**
 * Setup initializing step form.
 */
export default function SetupInitializingForm() {
  const {
    mutateAsync: buildTenantMutate,
    isLoading,
    isError,
  } = useBuildTenant();

  useEffect(() => {
    buildTenantMutate();
  }, [buildTenantMutate]);

  return (
    <div class="setup-initializing-form">
      {isLoading && <ProgressBar intent={Intent.PRIMARY} value={null} />}

      <div className={'setup-initializing-form__title'}>
        {isLoading ? (
          <>
            <h1>It's time to make your accounting really simple!</h1>
            <p className={'paragraph'}>
              while we set up your account, please remember to verify your
              account by clicking on the link we sent to yout registered email
              address
            </p>
          </>
        ) : isError ? (
          <>
            <h1>Something went wrong!</h1>
            <p class="paragraph">Please refresh the page</p>
          </>
        ) : (
          <>
            <h1>Waiting to redirect</h1>
            <p class="paragraph">Refresh the page if redirect not worked.</p>
          </>
        )}
      </div>
    </div>
  );
}
