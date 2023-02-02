// @ts-nocheck
import React from 'react';
import AuthCopyright from './AuthCopyright';

/**
 * Authentication insider page.
 */
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
