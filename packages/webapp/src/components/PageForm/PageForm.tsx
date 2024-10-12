import React, { FC } from 'react';
import clsx from 'classnames';
import { x, SystemProps } from '@xstyled/emotion';
import { css } from '@emotion/css';
import { Group, GroupProps } from '@/components';

interface PageFormProps extends SystemProps {
  children: React.ReactNode;
}

/**
 *
 * @returns {React.ReactNode}
 */
export const PageForm = ({ children, ...props }: PageFormProps) => {
  return (
    <x.div display="flex" flexDirection={'column'} overflow="hidden" {...props}>
      {children}
    </x.div>
  );
};
PageForm.displayName = 'PageFormBody';

/**
 *
 * @returns {React.ReactNode}
 */
const PageFormBody: FC<{ children: React.ReactNode } & SystemProps> = ({
  children,
}) => {
  return (
    <x.div flex="1" overflow="auto">
      {children}{' '}
    </x.div>
  );
};
PageFormBody.displayName = 'PageFormBody';

/**
 *
 * @returns {React.ReactNode}
 */
const PageFormFooter: FC<{ children: React.ReactNode } & SystemProps> = ({ children }) => {
  return <x.div>{children} </x.div>;
};

PageFormFooter.displayName = 'PageFormFooter';

const footerActionsStyle = `
  width: 100%;
  background: #fff;
  padding: 14px 18px;
  border-top: 1px solid rgb(210, 221, 226);
  box-shadow: 0px -1px 4px 0px rgba(0, 0, 0, 0.05);

  .bp4-button-group{
    .bp4-button{
      &:not(:last-child),
      &.bp4-popover-wrapper:not(:last-child) {
        border-right: 1px solid rgba(92, 112, 127, 0.3);
        margin-right: 0;

        &.bp4-intent-primary{
          border-right: 1px solid rgba(255, 255, 255, 0.3);
        }
      }
    }
  }
`;

const PageFormFooterActions: FC<GroupProps> = ({
  children,
  className,
  ...restProps
}) => {
  return (
    <Group
      spacing={20}
      {...restProps}
      className={clsx(css(footerActionsStyle), className)}
    >
      {children}
    </Group>
  );
};
PageFormFooterActions.displayName = 'PageFormFooterActions';

PageForm.Body = PageFormBody;
PageForm.Footer = PageFormFooter;
PageForm.FooterActions = PageFormFooterActions;
