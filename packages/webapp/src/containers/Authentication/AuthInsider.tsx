// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import AuthCopyright from './AuthCopyright';
import { AuthInsiderContent, AuthInsiderCopyright } from './_components';

/**
 * Authentication insider page.
 */
export default function AuthInsider({
  logo = true,
  copyright = true,
  children,
  classNames,
}) {
  return (
    <AuthInsiderContent>
      <AuthInsiderContentWrap className={classNames?.content}>
        {children}
      </AuthInsiderContentWrap>

      {copyright && (
        <AuthInsiderCopyright className={classNames?.copyrightWrap}>
          <AuthCopyright />
        </AuthInsiderCopyright>
      )}
    </AuthInsiderContent>
  );
}

const AuthInsiderContentWrap = styled.div``;
