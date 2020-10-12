import React, { useState, useCallback } from 'react';
import { Icon } from 'components';
import { FormattedMessage as T } from 'react-intl';

import withAuthenticationActions from 'containers/Authentication/withAuthenticationActions';

import { compose } from 'utils';

/**
 * Wizard setup left section.
 */
function SetupLeftSection({
  // #withAuthenticationActions
  requestLogout,
}) {
  const [org] = useState('LibyanSpider');

  const onClickLogout = useCallback(() => {
    requestLogout();
  }, [requestLogout]);

  return (
    <section className={'setup-page__left-section'}>
      <div className={'content'}>
        <div className={'content-logo'}>
          <Icon
            icon={'bigcapital'}
            width={165}
            height={28}
            className="bigcapital--alt"
          />
        </div>

        <h1 className={'content-title'}>
          <T id={'register_a_new_organization_now'} />
        </h1>

        <p className={'content-text'}>
          <T id={'you_have_a_bigcapital_account'} />
        </p>

        <div className={'content-org'}>
          <span>
            <T id={'welcome'} />
            {org},
          </span>
          <span>
            <a onClick={onClickLogout} href="#"><T id={'sign_out'} /></a>
          </span>
        </div>

        <div className={'content-contact'}>
          <a href={'#!'}>
            <p>
              <T id={'we_re_here_to_help'} /> {'+21892-791-8381'}
            </p>
          </a>
          <a href={'#!'}>
            <p>
              <T id={'contact_us_technical_support'} />
            </p>
          </a>
        </div>
      </div>
    </section>
  )
}

export default compose(
  withAuthenticationActions,
)(SetupLeftSection);
