import { Button, ButtonProps, Intent } from '@blueprintjs/core';
import styled from 'styled-components';
import { FormattedMessage as T } from '@/components';

/**
 * Official Google "G" mark.
 */
function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.859-3.0477.859-2.344 0-4.3282-1.5831-5.036-3.7104H.9573v2.3327C2.4382 15.9832 5.4818 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2823-1.71V4.9573H.9573C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9573 4.0427L3.964 10.71z"
      />
      <path
        fill="#EA4335"
        d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9573L3.964 7.29C4.6718 5.1627 6.656 3.5795 9 3.5795z"
      />
    </svg>
  );
}

/**
 * "Continue with Google" button. Kicks off the server-side OAuth redirect.
 */
export function GoogleAuthButton(props: ButtonProps) {
  const handleClick = () => {
    window.location.assign('/api/auth/google');
  };

  return (
    <GoogleButton
      {...props}
      type="button"
      large={true}
      fill={true}
      intent={Intent.NONE}
      onClick={handleClick}
    >
      <GoogleIcon />
      <span>
        <T id={'continue_with_google'} />
      </span>
    </GoogleButton>
  );
}

/**
 * Google button followed by an "or" divider, for use above email forms.
 */
export function GoogleAuthSection() {
  return (
    <GoogleAuthSectionRoot>
      <GoogleAuthButton />
      <Divider>
        <span>
          <T id={'or'} />
        </span>
      </Divider>
    </GoogleAuthSectionRoot>
  );
}

const GoogleButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 500;

  svg {
    flex-shrink: 0;
  }
`;

const GoogleAuthSectionRoot = styled.div`
  margin-bottom: 20px;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  color: #8a8a8a;
  font-size: 12px;
  text-transform: uppercase;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(0, 0, 0, 0.12);
  }

  .bp4-dark & {
    color: rgba(255, 255, 255, 0.55);

    &::before,
    &::after {
      background: rgba(255, 255, 255, 0.15);
    }
  }
`;
