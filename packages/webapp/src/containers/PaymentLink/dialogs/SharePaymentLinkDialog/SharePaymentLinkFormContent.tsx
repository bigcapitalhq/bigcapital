// @ts-nocheck
import { useFormikContext } from 'formik';
import {
  Button,
  Classes,
  DialogBody,
  DialogFooter,
  FormGroup,
  InputGroup,
  Intent,
  Position,
  Tooltip,
} from '@blueprintjs/core';
import {
  DialogFooterActions,
  FDateInput,
  FFormGroup,
  FSelect,
  Icon,
  Stack,
} from '@/components';
import { useSharePaymentLink } from './SharePaymentLinkProvider';
import { useClipboard } from '@/hooks/utils/useClipboard';
import { useDialogActions } from '@/hooks/state';
import { useDialogContext } from '@/components/Dialog/DialogProvider';

export function SharePaymentLinkFormContent() {
  const { url } = useSharePaymentLink();
  const { closeDialog } = useDialogActions();
  const { name } = useDialogContext();
  const { isSubmitting } = useFormikContext();

  const clipboard = useClipboard();

  const handleCopyBtnClick = () => {
    clipboard.copy(url);
  };
  const handleCancelBtnClick = () => {
    closeDialog(name);
  };

  return (
    <>
      <DialogBody>
        <Stack spacing={0}>
          <FFormGroup
            name={'publicity'}
            label={'Visibility'}
            style={{ marginBottom: 10 }}
            inline
          >
            <FSelect
              name={'publicity'}
              items={[
                { value: 'private', text: 'Private' },
                { value: 'public', text: 'Public' },
              ]}
              input={({ activeItem, text, label, value }) => (
                <Button
                  text={text || 'Select an item ...'}
                  rightIcon={<Icon icon={'caret-down-16'} iconSize={16} />}
                  minimal
                />
              )}
              searchable={false}
              fastField
            />
          </FFormGroup>

          <p className={Classes.TEXT_MUTED} style={{ marginBottom: 20 }}>
            Select an expiration date and generate the link to share it with
            your customer. Remember that anyone who has access to this link can
            view, print or download it.
          </p>

          <FFormGroup
            name={'expiryDate'}
            label={'Expiration Date'}
            helperText={
              'By default, the link is set to expire 90 days from today.'
            }
            fastField
          >
            <FDateInput
              name={'expiryDate'}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              formatDate={(date) => date.toLocaleDateString()}
              parseDate={(str) => new Date(str)}
              inputProps={{
                fill: true,
                style: { minWidth: 260 },
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
                  <Tooltip content="Copy to clipboard" position={Position.TOP}>
                    <Button
                      onClick={handleCopyBtnClick}
                      minimal
                      icon={<Icon icon={'clipboard'} iconSize={16} />}
                    />
                  </Tooltip>
                }
              />
            </FormGroup>
          )}
        </Stack>
      </DialogBody>

      <DialogFooter>
        <DialogFooterActions>
          {url ? (
            <Button intent={Intent.PRIMARY} onClick={handleCopyBtnClick}>
              Copy Link
            </Button>
          ) : (
            <>
              <Button onClick={handleCancelBtnClick}>Cancel</Button>
              <Button
                type={'submit'}
                intent={Intent.PRIMARY}
                loading={isSubmitting}
                style={{ minWidth: 100 }}
              >
                Generate
              </Button>
            </>
          )}
        </DialogFooterActions>
      </DialogFooter>
    </>
  );
}
