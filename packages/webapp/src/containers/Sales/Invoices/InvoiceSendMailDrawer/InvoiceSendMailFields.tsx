import { Button, Intent } from "@blueprintjs/core";
import { useFormikContext } from "formik";
import { FFormGroup, FInputGroup, Group, Stack } from "@/components";
import { useDrawerContext } from "@/components/Drawer/DrawerProvider";
import { useDrawerActions } from "@/hooks/state";

export function InvoiceSendMailFields() {
  return (
    <Stack bg="white" flex={'1'} spacing={0} borderRight="1px solid #dcdcdd">
      <Stack overflow="auto" flex="1" p={'30px'}>
        <FFormGroup label={'Submit'} name={'subject'}>
          <FInputGroup name={'subject'} large />
        </FFormGroup>

        <FFormGroup label={'Message'} name={'message'}>
          <FInputGroup name={'message'} large />
        </FFormGroup>
      </Stack>

      <InvoiceSendMailFooter />
    </Stack>
  );
}

function InvoiceSendMailFooter() {
  const { isSubmitting } = useFormikContext();
  const { name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();

  const handleClose = () => {
    closeDrawer(name);
  };

  return (
    <Group
      py={'12px'}
      px={'16px'}
      borderTop="1px solid #d8d8d9"
      position={'apart'}
    >
      <Group spacing={10} ml={'auto'}>
        <Button
          disabled={isSubmitting}
          onClick={handleClose}
          style={{ minWidth: '65px' }}
        >
          Close
        </Button>

        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          style={{ minWidth: '85px' }}
          type="submit"
        >
          Send Mail
        </Button>
      </Group>
    </Group>
  );
}
