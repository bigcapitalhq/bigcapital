import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { toggleJournalSheeetFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithJournalActionsProps {
  toggleJournalSheetFilter: (toggle?: boolean) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithJournalActionsProps => ({
  toggleJournalSheetFilter: (toggle?: boolean) =>
    dispatch(toggleJournalSheeetFilterDrawer(toggle)),
});

export function withJournalActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithJournalActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithJournalActionsProps>
  >;
}
