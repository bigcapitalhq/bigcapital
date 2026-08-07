import { connect } from 'react-redux';
import type { RootState } from '@/store/reducers';
import {
  isDialogOpenFactory,
  getDialogPayloadFactory,
} from '@/store/dashboard/dashboard.selectors';

export type DialogBaseProps = {
  isOpen: boolean | undefined;
  payload: Record<string, unknown>;
};

function withDialogRedux<TMapped extends object = DialogBaseProps>(
  mapState?: (base: DialogBaseProps) => TMapped,
) {
  const isDialogOpen = isDialogOpenFactory();
  const getDialogPayload = getDialogPayloadFactory();

  const mapStateToProps = (
    state: RootState,
    props: { dialogName: string },
  ): TMapped => {
    const mapped: DialogBaseProps = {
      isOpen: isDialogOpen(state, props),
      payload: getDialogPayload(state, props),
    };
    return (mapState ? mapState(mapped) : mapped) as TMapped;
  };

  return connect(mapStateToProps);
}

export default withDialogRedux;
