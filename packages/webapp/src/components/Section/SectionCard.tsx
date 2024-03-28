import classNames from 'classnames';
import * as React from 'react';
import { DISPLAYNAME_PREFIX, HTMLDivProps, Props } from '@blueprintjs/core';
import { CLASSES } from '@/constants';

export interface SectionCardProps
  extends Props,
    HTMLDivProps,
    React.RefAttributes<HTMLDivElement> {
  /**
   * Whether to apply visual padding inside the content container element.
   *
   * @default true
   */
  padded?: boolean;
}

/**
 * Section card component.
 *
 * @see https://blueprintjs.com/docs/#core/components/section.section-card
 */
export const SectionCard: React.FC<SectionCardProps> = React.forwardRef(
  (props, ref) => {
    const { className, children, padded, ...htmlProps } = props;
    const classes = classNames(
      CLASSES.SECTION_CARD,
      { [CLASSES.PADDED]: padded },
      className,
    );
    return (
      <div className={classes} ref={ref} {...htmlProps}>
        {children}
      </div>
    );
  },
);
SectionCard.defaultProps = {
  padded: true,
};
SectionCard.displayName = `${DISPLAYNAME_PREFIX}.SectionCard`;
