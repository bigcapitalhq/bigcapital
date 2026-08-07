import { useCategorizeTransactionBoot } from './CategorizeTransactionBoot';
import { FFormGroup, FeatureCan } from '@/components';
import { BranchSuggestField } from '@/components/Branches/BranchSuggestField_';
import { Features } from '@/constants';

export function CategorizeTransactionBranchField() {
  const { branches } = useCategorizeTransactionBoot();

  return (
    <FeatureCan feature={Features.Branches}>
      <FFormGroup name={'branchId'} label={'Branch'} fastField inline>
        <BranchSuggestField
          name={'branchId'}
          items={branches ?? []}
          popoverProps={{ minimal: true }}
          fill
        />
      </FFormGroup>
    </FeatureCan>
  );
}
