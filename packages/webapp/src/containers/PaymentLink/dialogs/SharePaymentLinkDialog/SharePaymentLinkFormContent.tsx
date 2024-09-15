// @ts-nocheck
import {
  Button,
  FormGroup,
  InputGroup,
  Intent,
  Position,
} from '@blueprintjs/core';
import {
  DialogFooter,
  FDateInput,
  FFormGroup,
  FSelect,
  Icon,
  Stack,
} from '@/components';
import { useSharePaymentLink } from './SharePaymentLinkProvider';
import { useClipboard } from '@/hooks/utils/useClipboard';

export function SharePaymentLinkFormContent() {
  const { url } = useSharePaymentLink();

  const clipboard = useClipboard();

  const handleCopyBtnClick = () => {
    clipboard.copy(url);
  };

  return (
    <>
      <Stack>
        <FSelect
          name={'publicity'}
          items={[
            { value: 'private', text: 'Private' },
            { value: 'public', text: 'Public' },
          ]}
          fastField
        />
        <FFormGroup name={'expiryDate'} label={'Expiration Date'} fastField>
          <FDateInput
            name={'expiryDate'}
            popoverProps={{ position: Position.BOTTOM, minimal: true }}
            formatDate={(date) => date.toLocaleDateString()}
            parseDate={(str) => new Date(str)}
            inputProps={{
              fill: true,
              leftElement: <Icon icon={'date-range'} />,
            }}
            fastField
          />
        </FFormGroup>

        {url && (
          <FormGroup name={'link'} label={'Payment Link'}>
            <InputGroup
              name={'link'}
              value={url}
              disabled
              leftElement={
                <Button onClick={handleCopyBtnClick} minimal>
                  Copy
                </Button>
              }
            />
          </FormGroup>
        )}
      </Stack>

      <DialogFooter>
        {url ? (
          <Button intent={Intent.PRIMARY} onClick={handleCopyBtnClick}>
            Copy Link
          </Button>
        ) : (
          <>
            <Button type={'submit'} intent={Intent.PRIMARY}>
              Generate
            </Button>
            <Button>Cancel</Button>
          </>
        )}
      </DialogFooter>
    </>
  );
}
