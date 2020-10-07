import React from 'react';
import Icon from 'components/Icon';
import AuthCopyright from './AuthCopyright';

export default function AuthInsider({
  logo = true,
  copyright = true,
  children,
}) {
  return (
    <div class="authentication-insider">
      <div className={'authentication-insider__logo-section'}>
        {/* <Icon icon="bigcapital" height={37} width={214} /> */}
      </div>

      <div class="authentication-insider__content">{children}</div>

      <div class="authentication-insider__footer">
        <AuthCopyright />
      </div>
    </div>
  );
}
