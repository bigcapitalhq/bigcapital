import type { RootState } from '@/store/reducers';
import type { AnyAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';
import { SET_ORGANIZATION_CONGRATS } from '@/store/types';

export const setOrganizationSetupCompleted =
  (congrats: boolean): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch, getState) => {
    const organizationId = getState().authentication.organizationId as string;

    dispatch({
      type: SET_ORGANIZATION_CONGRATS,
      payload: { organizationId, congrats },
    });
  };
