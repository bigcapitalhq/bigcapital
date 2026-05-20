// @ts-nocheck
import { connect } from 'react-redux';
import { getUnrealizedGainOrLossFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';

export const withUnrealizedGainOrLoss = (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      unrealizedGainOrLossDrawerFilter:
        getUnrealizedGainOrLossFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
