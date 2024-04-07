// @ts-nocheck
import { connect } from 'react-redux';

const mapDispatchToProps = (dispatch, props) => {
  return {
    addQuery: (key, value) => {
      const pathname = props.location.pathname;
      const searchParams = new URLSearchParams(props.location.search);

      searchParams.set(key, value);

      props.history.push({
        pathname: pathname,
        search: searchParams.toString(),
      });
    },

    removeQuery: (key) => {
      const pathname = props.location.pathname;
      const searchParams = new URLSearchParams(props.location.search);
      // returns the existing query string: '?type=fiction&author=fahid'
      searchParams.delete(key);
      props.history.push({
        pathname: pathname,
        search: searchParams.toString(),
      });
    },
  };
};

export default connect(null, mapDispatchToProps);
