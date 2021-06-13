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

  useEffect(() => {
    buildTenantMutate();
  }, [buildTenantMutate]);

  return (
    <div class="setup-initializing-form">
      {isLoading && <ProgressBar intent={Intent.PRIMARY} value={null} />}

      <div className={'setup-initializing-form__title'}>
        {isLoading ? (
          <>
            <h1>
              <T id={'it_s_time_to_make_your_accounting_really_simple'} />
            </h1>
            <p className={'paragraph'}>
              <T
                id={
                  'while_we_set_up_your_account_please_remember_to_verify_your_account'
                }
              />
            </p>
          </>
        ) : isError ? (
          <>
            <h1>
              <T id={'something_went_wrong'} />
            </h1>
            <p class="paragraph">
              <T id={'please_refresh_the_page'} />
            </p>
          </>
        ) : (
          <>
            <h1>
              <T id={'waiting_to_redirect'} />
            </h1>
            <p class="paragraph">
              <T id={'refresh_the_page_if_redirect_not_worked'} />
            </p>
          </>
        )}
      </div>
    </div>
  );
}
