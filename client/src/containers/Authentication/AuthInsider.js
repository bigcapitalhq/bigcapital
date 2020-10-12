import React from 'react';
import Icon from 'components/Icon';
import AuthCopyright from './AuthCopyright';

export default function AuthInsider({
  logo = true,
  copyright = true,
  children,
}) {
  return (
    <div class="authentication-insider__content">
      
      <div class="authentication-insider__form">
        { children }
      </div>

      <div class="authentication-insider__footer">
        <AuthCopyright />
      </div>
    </div>
  );
}
