// @ts-nocheck
import { connect } from 'react-redux';


const mapDispatchToProps = (dispatch, props) => {
  return {
    addQuery: (key, value) => {
      let pathname = props.location.pathname;
      let searchParams = new URLSearchParams(props.location.search);

      searchParams.set(key, value);

      props.history.push({
        pathname: pathname,
        search: searchParams.toString(),
      });
    },

    removeQuery: (key) => {
      let pathname = props.location.pathname;
      let searchParams = new URLSearchParams(props.location.search);
      // returns the existing query string: '?type=fiction&author=fahid'
      searchParams.delete(key);
      props.history.push({
        pathname: pathname,
        search: searchParams.toString(),
      });
    },
  }
}

export default connect(null, mapDispatchToProps)  