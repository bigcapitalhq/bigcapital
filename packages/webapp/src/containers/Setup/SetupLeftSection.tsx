// @ts-nocheck
import React from 'react';
import { Icon, For, FormattedMessage as T } from '@/components';

import { getFooterLinks } from '@/constants/footerLinks';
import { useAuthOidcLogout } from '@/hooks/query'
import { LoadingOverlay } from '@/components/LoadingOverlay'

/**
 * Footer item link.
 */
function FooterLinkItem({ title, link }) {
  return (
    <div class="content__links-item">
      <a href={link} target="_blank">
        {title}
      </a>
    </div>
  );
}

/**
 * Setup left section footer.
 */
function SetupLeftSectionFooter() {
  // Retrieve the footer links.
  const footerLinks = getFooterLinks();

  return (
    <div className={'content__footer'}>
      <div className={'content__links'}>
        <For render={FooterLinkItem} of={footerLinks} />
      </div>
    </div>
  );
}

/**
 * Setup left section header.
 */
function SetupLeftSectionHeader() {
  const {isLoading:isLoggingOut, mutateAsync: oidcLogoutMutate } = useAuthOidcLogout();

  // Handle logout link click.
  const onClickLogout = () => {
    oidcLogoutMutate();
  };

  return (
    <>
      <div className={'content__header'}>
        <h1 className={'content__title'}>
          <T id={'setup.left_side.title'} />
        </h1>

      <p className={'content__text'}>
        <T id={'setup.left_side.description'} />
      </p>

        <div className={'content__organization'}>
          <span class="signout">
            <a onClick={onClickLogout} href="#">
              <T id={'sign_out'} />
            </a>
          </span>
        </div>
      </div>

      {isLoggingOut && <LoadingOverlay />}
    </>
  );
}

/**
 * Wizard setup left section.
 */
export default function SetupLeftSection() {
  return (
    <section className={'setup-page__left-section'}>
      <div className={'content'}>
        <div className={'content__logo'}>
          <Icon
            icon="bigcapital"
            className={'bigcapital--alt'}
            height={37}
            width={190}
          />
        </div>
        <SetupLeftSectionHeader />
        <SetupLeftSectionFooter />
      </div>
    </section>
  );
}
