// @ts-nocheck
import { FFormGroup, FeatureCan } from '@/components';
import { useCategorizeTransactionBoot } from './CategorizeTransactionBoot';
import { Features } from '@/constants';
import { BranchSuggestField } from '@/components/Branches/BranchSuggestField_';

export function CategorizeTransactionBranchField() {
  const { branches } = useCategorizeTransactionBoot();

  return (
    <FFormGroup name={'branchId'} label={'Branch'} fastField inline>
      <FeatureCan feature={Features.Branches}>
        <BranchSuggestField
          name={'branchId'}
          items={branches}
          popoverProps={{ minimal: true }}
          fill
        />
      </FeatureCan>
    </FFormGroup>
  );
}
