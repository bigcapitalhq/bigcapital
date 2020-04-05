import {connect} from 'react-redux';

export const mapStateToProps = (state, props) => {
  return {
    organizationSettings: state.settings.data.organization,
  };
};

export const mapDispatchToProps = (dispatch) => ({
  
});

export default connect(mapStateToProps, mapDispatchToProps);