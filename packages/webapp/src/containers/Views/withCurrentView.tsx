// @ts-nocheck
import { connect } from 'react-redux';

const mapStateToProps = (state, props) => ({
  currentViewId: props.match.params.custom_view_id,
});

export const withCurrentView = connect(mapStateToProps);
