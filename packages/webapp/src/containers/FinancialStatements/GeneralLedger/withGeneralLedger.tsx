// @ts-nocheck
import { connect } from 'react-redux';
import {
  getGeneralLedgerFilterDrawer
} from '@/store/financialStatement/financialStatements.selectors';

export const withGeneralLedger = (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      generalLedgerFilterDrawer: getGeneralLedgerFilterDrawer(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
