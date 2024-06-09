// @ts-nocheck
import { FSuggest } from '../Forms';

interface BranchSuggestFieldProps {
  items: any[];
}

export function BranchSuggestField({ ...props }: BranchSuggestFieldProps) {
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
