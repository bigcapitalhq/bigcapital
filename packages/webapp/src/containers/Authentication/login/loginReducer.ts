import type { MfaChallenge } from './types';

export type LoginState =
  | { status: 'credentials' }
  | { status: 'mfa'; challenge: MfaChallenge }
  | { status: 'complete' };

export type LoginAction =
  | { type: 'challenge-received'; challenge: MfaChallenge }
  | { type: 'signin-complete' }
  | { type: 'restart' };

export const initialLoginState: LoginState = { status: 'credentials' };

export function loginReducer(
  state: LoginState,
  action: LoginAction,
): LoginState {
  switch (action.type) {
    case 'challenge-received':
      return { status: 'mfa', challenge: action.challenge };
    case 'signin-complete':
      return { status: 'complete' };
    case 'restart':
      return { status: 'credentials' };
    default:
      return state;
  }
}
