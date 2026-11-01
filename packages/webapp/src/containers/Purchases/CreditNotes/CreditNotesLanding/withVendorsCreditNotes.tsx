import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ApplicationState } from '@/store/reducers';
import type { ComponentType } from 'react';
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

export function withVendorsCreditNotes<
  Props = unknown,
  Mapped extends object = WithVendorsCreditNotesProps,
>(mapState?: MapState<WithVendorsCreditNotesProps, Props, Mapped>) {
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
  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof Mapped>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<Omit<P, keyof Mapped>>;
  };
}
