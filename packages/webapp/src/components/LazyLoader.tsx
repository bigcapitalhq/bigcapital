// import React from 'react';
// import Loadable from 'react-loadable';

// const DefaultLoadingComponent = () => <div>Loading...</div>;
// const DefaultErrorComponent = ({ retry }) => (
//   <div>
//     Error loading component. <button onClick={retry}>Retry</button>
//   </div>
// );

// const Loader = ({
//   errorComponent: ErrorComponent = DefaultErrorComponent,
//   loadingComponent: LoadingComponent = DefaultLoadingComponent,
//   retryDelay = 1000,
//   ...config
// }) =>
//   Loadable({
//     loader: () => Promise.resolve({}), // Add loader property
//     render: () => {}, // Add render property
//     loading: ({ error, retry, pastDelay }) => {
//       if (error) {
//         console.error('======= DefaultLoader Error =======');
//         console.error(error);
//         console.error('====================================');
//         return <ErrorComponent retry={retry} />;
//       }
//       if (pastDelay) {
//         return <LoadingComponent />;
//       }
//       return null;
//     },
//     delay: 250,
//     timeout: 10000, // 10 seconds timeout
//     ...config,
//   });

// export default Loader;


import React from 'react';
import Loadable from 'react-loadable';

const Loader = (config) => Loadable({
  ...config,
  loading: ({ error, retry, pastDelay }) => {
    if (error) {
      console.error('======= DefaultLoader Error =======');
      console.error(error);
      console.error('====================================');
      // Optionally, display an error message or a retry button
      return <div>Error loading component. <button onClick={retry}>Retry</button></div>;
    } else if (pastDelay) {
      // Display a loading spinner or message
      return <div>Loading...</div>;
    }
    return null;
  },
  render: (loaded, props) => {
    // `loaded` is the module object that was dynamically imported
    const Component = loaded.default; // Assuming the loaded module exports the component as default
    return <Component {...props} />; // Render the loaded component with props
  },
  delay: 250, // Minimal delay before showing the loading component
  // You can add other Loadable options here
});

export default Loader;
