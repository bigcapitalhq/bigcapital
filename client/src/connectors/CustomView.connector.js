import { connect } from 'react-redux';
import {
  fetchResourceViews,
} from 'store/customViews/customViews.actions';

const mapStateToProps = (state) => ({

});

const mapActionsToProps = (dispatch) => ({
  fetchResourceViews: (resourceSlug) => dispatch(fetchResourceViews({ resourceSlug })),
});

export default connect(mapStateToProps, mapActionsToProps);