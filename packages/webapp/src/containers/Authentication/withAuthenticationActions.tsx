import { connect } from 'react-redux';
import { Dispatch } from 'redux';

export interface WithAuthenticationActionsProps {
  // Reserved for future authentication actions (login/logout/register/etc.).
}

export const mapDispatchToProps = (
  _dispatch: Dispatch,
): WithAuthenticationActionsProps => ({});

export function withAuthenticationActions<P>() {
  return connect<{}, WithAuthenticationActionsProps, P>(
    null,
    mapDispatchToProps,
  );
}
