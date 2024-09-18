import { SelectPaymentMethodsBoot } from './SelectPaymentMethodsBoot';
import { SelectPaymentMethodsForm } from './SelectPaymemtMethodsForm';
import styled from 'styled-components';
import { Group, Stack } from '@/components';
import {
  DialogFooter,
  Button,
  Checkbox,
  DialogBody,
  Intent,
  Text,
} from '@blueprintjs/core';
import { useDialogActions } from '@/hooks/state';
import { DialogsName } from '@/constants/dialogs';
import { useUncontrolled } from '@/hooks/useUncontrolled';

export function SelectPaymentMethodsContent() {
  const { closeDialog } = useDialogActions();

  const handleCancelBtnClick = () => {
    closeDialog(DialogsName.SelectPaymentMethod);
  };
  return (
    <SelectPaymentMethodsBoot>
      <SelectPaymentMethodsForm>
        <DialogBody>
          <Stack spacing={12}>
            <PaymentMethodSelect
              label={'Card (Including Apple Pay, Google Pay and Link)'}
            />
            <PaymentMethodSelect
              label={'Card (Including Apple Pay, Google Pay and Link)'}
            />
            <PaymentMethodSelect
              label={'Card (Including Apple Pay, Google Pay and Link)'}
            />
            <PaymentMethodSelect
              label={'Card (Including Apple Pay, Google Pay and Link)'}
            />
            <PaymentMethodSelect
              label={'Card (Including Apple Pay, Google Pay and Link)'}
            />
            <PaymentMethodSelect
              label={'Card (Including Apple Pay, Google Pay and Link)'}
            />
          </Stack>
        </DialogBody>

        <DialogFooter
          actions={
            <>
              <Button onClick={handleCancelBtnClick}>Cancel</Button>
              <Button intent={Intent.PRIMARY}>Submit</Button>
            </>
          }
        ></DialogFooter>
      </SelectPaymentMethodsForm>
    </SelectPaymentMethodsBoot>
  );
}

interface PaymentMethodSelectProps {
  label: string;
  value?: boolean;
  initialValue?: boolean;
  onChange?: (value: boolean) => void;
}
function PaymentMethodSelect({
  value,
  initialValue,
  onChange,
  label,
}: PaymentMethodSelectProps) {
  const [_value, handleChange] = useUncontrolled<boolean>({
    value,
    initialValue,
    finalValue: false,
    onChange,
  });
  const handleClick = () => {
    handleChange(!_value);
  };

  return (
    <PaymentMethodSelectRoot onClick={handleClick}>
      <PaymentMethodCheckbox
        label={''}
        checked={_value}
        onClick={handleClick}
      />
      <PaymentMethodText>{label}</PaymentMethodText>
    </PaymentMethodSelectRoot>
  );
}

const PaymentMethodSelectRoot = styled(Group)`
  border: 1px solid #d3d8de;
  border-radius: 5px;
  padding: 10px;
  gap: 0;
  cursor: pointer;
`;

const PaymentMethodCheckbox = styled(Checkbox)`
  margin: 0;

  &.bp4-control .bp4-control-indicator {
    box-shadow: 0 0 0 1px #c5cbd3;
  }
`;

const PaymentMethodText = styled(Text)`
  color: #404854;
`;
