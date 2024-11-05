import { SystemProps, x } from '@xstyled/emotion';

export interface TextProps extends SystemProps {
  children?: React.ReactNode;
}

export const Text = ({ children, ...restProps }: TextProps) => {
  return <x.div {...restProps}>{children}</x.div>;
};
