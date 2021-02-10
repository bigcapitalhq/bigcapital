import { connect } from 'react-redux';
import {
  getManualJournalsTableStateFactory
} from 'store/manualJournals/manualJournals.selectors';

export default (mapState) => {
  const getJournalsTableQuery = getManualJournalsTableStateFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      manualJournalsTableState: getJournalsTableQuery(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
