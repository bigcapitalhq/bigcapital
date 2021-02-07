import { useDispatch } from 'react-redux';
import { dashboardPageTitle } from 'store/dashboard/dashboard.actions';

export const useDashboardPageTitle = () => {
  const dispatch = useDispatch();

  return (pageTitle) => {
    dispatch(dashboardPageTitle(pageTitle));
  }
};
