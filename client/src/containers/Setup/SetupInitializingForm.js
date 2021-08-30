import React, { useEffect } from 'react';
import { ProgressBar, Intent } from '@blueprintjs/core';
import { useBuildTenant } from 'hooks/query';
import { FormattedMessage as T } from 'components';

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

  React.useEffect(() => {
    buildTenantMutate();
  }, [buildTenantMutate]);

  return (
    <div class="setup-initializing-form">
      {isLoading && <ProgressBar intent={Intent.PRIMARY} value={null} />}

      <div className={'setup-initializing-form__title'}>
        {isLoading ? (
          <>
            <h1>
              <T id={'setup.initializing.title'} />
            </h1>
            <p className={'paragraph'}>
              <T id={'setup.initializing.description'} />
            </p>
          </>
        ) : isError ? (
          <>
            <h1>
              <T id={'setup.initializing.something_went_wrong'} />
            </h1>
            <p class="paragraph">
              <T id={'setup.initializing.please_refresh_the_page'} />
            </p>
          </>
        ) : (
          <>
            <h1>
              <T id={'setup.initializing.waiting_to_redirect'} />
            </h1>
            <p class="paragraph">
              <T
                id={
                  'setup.initializing.refresh_the_page_if_redirect_not_worked'
                }
              />
            </p>
          </>
        )}
      </div>
    </div>
  );
}
