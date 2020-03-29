import React, {useState, useEffect, useMemo} from 'react';
import { Spinner } from '@blueprintjs/core';

export default function LoadingIndicator({
  loading,
  spinnerSize = 40,
  children
}) {
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!loading) { setRendered(true); }
  }, [loading]);

  const componentStyle = useMemo(() => {
    return {display: !loading ? 'block' : 'none'};
  }, [loading]);

  const loadingComponent = useMemo(() => (
    <div class='dashboard__loading-indicator'>
      <Spinner size={spinnerSize} value={null} />
    </div>
  ), [spinnerSize]);

  const renderComponent = useMemo(() => (
    <div style={componentStyle}>{ children }</div>
  ), [children, componentStyle]);

  const maybeRenderComponent = rendered && renderComponent;
  const maybeRenderLoadingSpinner = loading && loadingComponent;

  return (
    <>
      { maybeRenderLoadingSpinner }
      { maybeRenderComponent }
    </>
  );
}
