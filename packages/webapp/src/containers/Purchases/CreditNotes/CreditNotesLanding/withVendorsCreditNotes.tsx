import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ApplicationState } from '@/store/reducers';
import {
  getVendorCreditTableStateFactory,
  isVendorCreditTableStateChangedFactory,
  getVendorsCreditNoteSelectedRowsFactory,
} from '@/store/vendor-credit/vendor-credit.selector';

export interface WithVendorsCreditNotesProps {
  vendorsCreditNoteTableState: ReturnType<
    ReturnType<typeof getVendorCreditTableStateFactory>
  >;
  vendorsCreditNoteTableStateChanged: ReturnType<
    ReturnType<typeof isVendorCreditTableStateChangedFactory>
  >;
  vendorsCreditNoteSelectedRows: ReturnType<
    ReturnType<typeof getVendorsCreditNoteSelectedRowsFactory>
  >;
}

export function withVendorsCreditNotes<Props = unknown>(
  mapState?: MapState<WithVendorsCreditNotesProps, Props>,
) {
  const getVendorsCreditNoteTableState = getVendorCreditTableStateFactory();
  const isVendorsCreditNoteTableChanged =
    isVendorCreditTableStateChangedFactory();
  const getVendorsCreditNoteSelectedRows =
    getVendorsCreditNoteSelectedRowsFactory();

  const mapStateToProps: MapStateToProps<
    WithVendorsCreditNotesProps,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithVendorsCreditNotesProps = {
      vendorsCreditNoteTableState: getVendorsCreditNoteTableState(
        state,
        props as never,
      ),
      vendorsCreditNoteTableStateChanged:
        isVendorsCreditNoteTableChanged(state),
      vendorsCreditNoteSelectedRows: getVendorsCreditNoteSelectedRows(state),
    };
    return mapState
      ? (mapState(mapped, state, props) as WithVendorsCreditNotesProps)
      : mapped;
  };
  return connect(mapStateToProps);
}
