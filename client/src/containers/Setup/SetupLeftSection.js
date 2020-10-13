import React, { useState, useCallback } from 'react';
import { Icon, For } from 'components';
import { FormattedMessage as T } from 'react-intl';

import withAuthenticationActions from 'containers/Authentication/withAuthenticationActions';

import footerLinks from 'config/footerLinks';
import { compose } from 'utils';


function FooterLinkItem({ title, link }) {
  return (
    <div class="">
      <a href={link} target="_blank">{ title }</a>
    </div>
  );
}

/**
 * Wizard setup left section.
 */
function SetupLeftSection({
  // #withAuthenticationActions
  requestLogout,
}) {
  const onClickLogout = useCallback(() => {
    requestLogout();
  }, [requestLogout]);

  return (
    <section className={'setup-page__left-section'}>
      <div className={'content'}>
        <div className={'content__logo'}>
          <Icon icon="bigcapital" className={'bigcapital--alt'} height={37} width={214} />
        </div>

        <h1 className={'content__title'}>
          <T id={'register_a_new_organization_now'} />
        </h1>

        <p className={'content__text'}>
          <T id={'you_have_a_bigcapital_account'} />
        </p>

        <div className={'content__organization'}>
          <span class="organization-id">Your oragnization ID: <span class="id">12342313</span>,</span><br />
          <span class="signout"><a onClick={onClickLogout} href="#"><T id={'sign_out'} /></a></span>
        </div>

        <span class="content__divider"></span>

        <div className={'content__footer'}>
          <div className={'content__contact-info'}> 
            <p><T id={'we_re_here_to_help'} /> {'+21892-791-8381'}</p>
          </div>

          <div className={'content__links'}>
            <For render={FooterLinkItem} of={footerLinks} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default compose(
  withAuthenticationActions,
)(SetupLeftSection);
