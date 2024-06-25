import { RuleFormBoot } from './RuleFormBoot';
import { RuleFormContentForm } from './RuleFormContentForm';

interface RuleFormContentProps {
  dialogName: string;
  bankRuleId?: number;
}

export default function RuleFormContent({
  dialogName,
  bankRuleId,
}: RuleFormContentProps) {
  return (
    <RuleFormBoot bankRuleId={bankRuleId}>
      <RuleFormContentForm />
    </RuleFormBoot>
  );
}