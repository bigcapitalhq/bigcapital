

import {connect} from 'react-redux';
import {
  makeJournalEntries,
} from 'store/accounting/accounting.actions';
import t from 'store/types';

export const mapStateToProps = (state, props) => ({

});

export const mapDispatchToProps = (dispatch) => ({
  makeJournalEntries: (form) => dispatch(makeJournalEntries({ form })),
});

export default connect(mapStateToProps, mapDispatchToProps);