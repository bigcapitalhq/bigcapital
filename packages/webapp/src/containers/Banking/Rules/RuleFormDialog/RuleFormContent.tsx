import { Classes } from '@blueprintjs/core';
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
      <div className={Classes.DIALOG_BODY}>
        <RuleFormContentForm />
      </div>
    </RuleFormBoot>
  );
}
