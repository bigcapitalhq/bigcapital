// @ts-nocheck
import * as React from 'react';
import * as Loadable from 'react-loadable';

const Loader = (config) =>
  Loadable({
    loading: (props) => {
      if (props.error) {
        /* tslint:disable */
        console.error(`======= DefaultLoader Error =======`);
        console.error(props.error);
        console.error(`======= DefaultLoader Error =======`);
        /* tslint:enable */
        return null;
      }
      return null;
    },
    delay: 250,
    ...config
  });

export default Loader;
