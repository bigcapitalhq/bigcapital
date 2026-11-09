import { connect } from 'react-redux';
import type { GlobalErrorsData } from '@/store/global-errors/global-errors.reducer';
import type { ComponentType } from 'react';
import { ApplicationState } from '@/store/reducers';

export interface WithGlobalErrorsProps {
  globalErrors: GlobalErrorsData;
}

const mapStateToProps = (state: ApplicationState): WithGlobalErrorsProps => {
  return {
    globalErrors: state.globalErrors.data,
  };
};

export function withGlobalErrors<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithGlobalErrorsProps>> {
  const Connected = connect(mapStateToProps)(
    WrappedComponent as ComponentType<any>,
  );
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithGlobalErrorsProps>
  >;
}
