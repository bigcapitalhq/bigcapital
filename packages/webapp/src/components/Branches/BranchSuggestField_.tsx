import React from 'react';
import { FSuggest } from '../Forms';

type BranchSuggestFieldProps = React.ComponentProps<typeof FSuggest> & {
  items: unknown[];
};

export function BranchSuggestField(props: BranchSuggestFieldProps) {
  return (
    <FSuggest
      valueAccessor={'id'}
      labelAccessor={'code'}
      textAccessor={'name'}
      inputProps={{ placeholder: 'Select a branch' }}
      {...props}
    />
  );
}
