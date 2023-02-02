// @ts-nocheck
import React from 'react';
import { DialogContent } from '@/components';

const ProjectExpenseFormContext = React.createContext();

/**
 * Project expense form provider.
 * @returns
 */
function ProjectExpenseFormProvider({
  //#OwnProps
  dialogName,
  expenseId,
  ...props
}) {
  // state provider.
  const provider = {
    dialogName,
  };

  return (
    <DialogContent>
      <ProjectExpenseFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useProjectExpenseFormContext = () =>
  React.useContext(ProjectExpenseFormContext);
export { ProjectExpenseFormProvider, useProjectExpenseFormContext };
