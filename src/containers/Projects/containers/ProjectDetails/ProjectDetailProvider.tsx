// @ts-nocheck
import React from 'react';

const ProjectDetailContext = React.createContext();

/**
 * Project detail provider.
 * @returns
 */
function ProjectDetailProvider({
  // #ownProps
  ...props
}) {
  // State provider.
  const provider = {};
  return (
    <React.Fragment>
      <ProjectDetailContext.Provider value={provider} {...props} />
    </React.Fragment>
  );
}

const useProjectDetailContext = () => React.useContext(ProjectDetailContext);

export { ProjectDetailProvider, useProjectDetailContext };
