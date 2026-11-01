import {
  Intent,
  Button,
  ButtonGroup,
  Popover,
  PopoverInteractionKind,
  Position,
  Menu,
  MenuItem,
} from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import styled from 'styled-components';
import { useItemFormContext } from './ItemFormProvider';
import type { ItemFormValues } from './types';
import { Group, Icon, FormattedMessage as T } from '@/components';

/**
 * Item form floating actions bar.
 */
export function ItemFormFloatingActions() {
  // Formik context.
  const { isSubmitting, submitForm } = useFormikContext<ItemFormValues>();

  // Item form context.
  const { isNewMode, setSubmitPayload } = useItemFormContext();

  // Handle the submit button.
  const handleSubmitBtnClick = () => {
    setSubmitPayload({ redirect: true });
  };

  // Handle the submit & new button click.
  const handleSubmitAndNewClick = () => {
    submitForm();
    setSubmitPayload({ redirect: false });
  };

  return (
    <FloatingActionsGroup spacing={10}>
      <ButtonGroup>
        {/* ----------- Save and New ----------- */}
        <Button
          disabled={isSubmitting}
          loading={isSubmitting}
          intent={Intent.PRIMARY}
          type="submit"
          onClick={handleSubmitBtnClick}
          text={!isNewMode ? <T id={'edit'} /> : <T id={'save'} />}
        />
        <Popover
          content={
            <Menu>
              <MenuItem
                text={<T id={'save_and_new'} />}
                onClick={handleSubmitAndNewClick}
              />
            </Menu>
          }
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_RIGHT}
          minimal
        >
          <Button
            disabled={isSubmitting}
            intent={Intent.PRIMARY}
            rightIcon={<Icon icon="arrow-drop-up-16" iconSize={20} />}
          />
        </Popover>
      </ButtonGroup>
    </FloatingActionsGroup>
  );
}

const FloatingActionsGroup = styled(Group)`
  padding: 10px 0;
  padding-left: 165px;
  border-top: 1px solid #50555a;
  position: sticky;
  bottom: 0;
  background: var(--color-card-background);
  z-index: 1;
`;
