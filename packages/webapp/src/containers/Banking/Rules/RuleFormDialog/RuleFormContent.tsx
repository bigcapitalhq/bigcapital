import { RuleFormBoot } from "./RuleFormBoot";


interface RuleFormContentProps {
  dialogName: string;
  bankRuleId?: number;
}
export function RuleFormContent({
  dialogName,
  bankRuleId,
}: RuleFormContentProps) {
  return (
    <RuleFormBoot
      bankRuleId={bankRuleId}
    >
      
    </RuleFormBoot>
  );
}
