import React from 'react';
import DashboardInsider from '../../../components/Dashboard/DashboardInsider';


const ProjectsListContext = React.createContext({});

/**
 * Projects list data provider.
 * @returns
 */
function ProjectsListProvider({ query, tableStateChanged, ...props }) {
  // provider payload.

  const provider = {};

  return (
    <DashboardInsider
      // loading={}
      name={'projects'}
    >
      <ProjectsListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useProjectsListContext = () => React.useContext(ProjectsListContext);

export { ProjectsListProvider, useProjectsListContext };
