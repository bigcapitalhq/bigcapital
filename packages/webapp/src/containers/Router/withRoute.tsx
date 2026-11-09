import { withRouter } from 'react-router-dom';

export const withRoute = (_mapState?: unknown) => {
  return () => withRouter;
};
