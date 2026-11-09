import { ReactNode } from 'react';
import styled from 'styled-components';
import { AuthInsiderContent, AuthInsiderCopyright } from './_components';
import { AuthCopyright } from './AuthCopyright';

export interface AuthInsiderProps {
  logo?: boolean;
  copyright?: boolean;
  children?: ReactNode;
  classNames?: {
    content?: string;
    copyrightWrap?: string;
  };
}

/**
 * Authentication insider page.
 */
export function AuthInsider({
  logo = true,
  copyright = true,
  children,
  classNames,
}: AuthInsiderProps) {
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
