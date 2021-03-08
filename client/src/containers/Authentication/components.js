import React from 'react';
import { FormattedMessage as T } from 'react-intl';
import ContentLoader from 'react-content-loader';
import { If, Icon } from 'components';
import { saveInvoke } from 'utils';

export function PasswordRevealer({ defaultShown = false, onChange }) {
  const [shown, setShown] = React.useState(defaultShown);

  const handleClick = () => {
    setShown(!shown);
    saveInvoke(onChange, !shown);
  };

  return (
    <span class="password-revealer" onClick={handleClick}>
      <If condition={shown}>
        <Icon icon="eye-slash" />{' '}
        <span class="text">
          <T id={'hide'} />
        </span>
      </If>
      <If condition={!shown}>
        <Icon icon="eye" />{' '}
        <span class="text">
          <T id={'show'} />
        </span>
      </If>
    </span>
  );
}

/**
 * Invite accept loading space.
 */
export function InviteAcceptLoading({ isLoading, children, ...props }) {
  return isLoading ? (
    <ContentLoader
      speed={2}
      width={400}
      height={280}
      viewBox="0 0 400 280"
      backgroundColor="#f3f3f3"
      foregroundColor="#e6e6e6"
      {...props}
    >
      <rect x="0" y="80" rx="2" ry="2" width="200" height="20" />
      <rect x="0" y="0" rx="2" ry="2" width="250" height="30" />
      <rect x="0" y="38" rx="2" ry="2" width="300" height="15" />
      <rect x="0" y="175" rx="2" ry="2" width="200" height="20" />
      <rect x="1" y="205" rx="2" ry="2" width="385" height="38" />
      <rect x="0" y="110" rx="2" ry="2" width="385" height="38" />
    </ContentLoader>
  ) : (
    children
  );
}
