import classNames from 'classnames';
import React from 'react';
import {
  Card,
  Collapse,
  type CollapseProps,
  Elevation,
  Utils,
  DISPLAYNAME_PREFIX,
  type HTMLDivProps,
  type MaybeElement,
  type Props,
  IconName,
} from '@blueprintjs/core';
import { H6 } from '@blueprintjs/core';
import { CLASSES } from '@/constants';
import { Icon } from '../Icon';

/**
 * Subset of {@link Elevation} options which are visually supported by the {@link Section} component.
 *
 * Note that an elevation greater than 1 creates too much visual clutter/noise in the UI, especially when
 * multiple Sections are shown on a single page.
 */
export type SectionElevation = typeof Elevation.ZERO | typeof Elevation.ONE;

export interface SectionCollapseProps
  extends Pick<
    CollapseProps,
    'className' | 'isOpen' | 'keepChildrenMounted' | 'transitionDuration'
  > {
  /**
   * Whether the component is initially open or closed.
   *
   * This prop has no effect if `collapsible={false}` or the component is in controlled mode,
   * i.e. when `isOpen` is **not** `undefined`.
   *
   * @default true
   */
  defaultIsOpen?: boolean;

  /**
   * Whether the component is open or closed.
   *
   * Passing a boolean value to `isOpen` will enabled controlled mode for the component.
   */
  isOpen?: boolean;

  /**
   * Callback invoked in controlled mode when the collapse toggle element is clicked.
   */
  onToggle?: () => void;
}

export interface SectionProps extends Props, Omit<HTMLDivProps, 'title'> {
  /**
   * Whether this section's contents should be collapsible.
   *
   * @default false
   */
  collapsible?: boolean;

  /**
   * Subset of props to forward to the underlying {@link Collapse} component, with the addition of a
   * `defaultIsOpen` option which sets the default open state of the component when in uncontrolled mode.
   */
  collapseProps?: SectionCollapseProps;

  /**
   * Whether this section should use compact styles.
   *
   * @default false
   */
  compact?: boolean;

  /**
   * Visual elevation of this container element.
   *
   * @default Elevation.ZERO
   */
  elevation?: SectionElevation;

  /**
   * Name of a Blueprint UI icon (or an icon element) to render in the section's header.
   * Note that the header will only be rendered if `title` is provided.
   */
  icon?: IconName | MaybeElement;

  /**
   * Element to render on the right side of the section header.
   * Note that the header will only be rendered if `title` is provided.
   */
  rightElement?: JSX.Element;

  /**
   * Sub-title of the section.
   * Note that the header will only be rendered if `title` is provided.
   */
  subtitle?: JSX.Element | string;

  /**
   * Title of the section.
   * Note that the header will only be rendered if `title` is provided.
   */
  title?: JSX.Element | string;

  /**
   * Optional title renderer function. If provided, it is recommended to include a Blueprint `<H6>` element
   * as part of the title. The render function is supplied with `className` and `id` attributes which you must
   * forward to the DOM. The `title` prop is also passed along to this renderer via `props.children`.
   *
   * @default H6
   */
  titleRenderer?: React.FC<React.HTMLAttributes<HTMLElement>>;
}

/**
 * Section component.
 *
 * @see https://blueprintjs.com/docs/#core/components/section
 */
export const Section: React.FC<SectionProps> = React.forwardRef(
  (props, ref) => {
    const {
      children,
      className,
      collapseProps,
      collapsible,
      compact,
      elevation,
      icon,
      rightElement,
      subtitle,
      title,
      titleRenderer = H6,
      ...htmlProps
    } = props;
    // Determine whether to use controlled or uncontrolled state.
    const isControlled = collapseProps?.isOpen != null;

    // The initial useState value is negated in order to conform to the `isCollapsed` expectation.
    const [isCollapsedUncontrolled, setIsCollapsed] = React.useState<boolean>(
      !(collapseProps?.defaultIsOpen ?? true),
    );

    const isCollapsed = isControlled
      ? !collapseProps?.isOpen
      : isCollapsedUncontrolled;

    const toggleIsCollapsed = React.useCallback(() => {
      if (isControlled) {
        collapseProps?.onToggle?.();
      } else {
        setIsCollapsed(!isCollapsed);
      }
    }, [collapseProps, isCollapsed, isControlled]);

    const isHeaderRightContainerVisible = rightElement != null || collapsible;

    const sectionId = Utils.uniqueId('section');
    const sectionTitleId = title ? Utils.uniqueId('section-title') : undefined;

    return (
      <Card
        className={classNames(className, CLASSES.SECTION, {
          [CLASSES.COMPACT]: compact,
          [CLASSES.SECTION_COLLAPSED]:
            (collapsible && isCollapsed) || Utils.isReactNodeEmpty(children),
        })}
        elevation={elevation}
        aria-labelledby={sectionTitleId}
        {...htmlProps}
        id={sectionId}
      >
        {title && (
          <div
            role={collapsible ? 'button' : undefined}
            aria-pressed={collapsible ? isCollapsed : undefined}
            aria-expanded={collapsible ? isCollapsed : undefined}
            aria-controls={collapsible ? sectionId : undefined}
            className={classNames(CLASSES.SECTION_HEADER, {
              [CLASSES.INTERACTIVE]: collapsible,
            })}
            onClick={collapsible ? toggleIsCollapsed : undefined}
          >
            <div className={CLASSES.SECTION_HEADER_LEFT}>
              {/* {icon && (
                <Icon
                  icon={icon}
                  aria-hidden={true}
                  tabIndex={-1}
                  className={CLASSES.TEXT_MUTED}
                />
              )} */}
              <div>
                {React.createElement(
                  titleRenderer,
                  {
                    className: CLASSES.SECTION_HEADER_TITLE,
                    id: sectionTitleId,
                  },
                  title,
                )}
                {subtitle && (
                  <div
                    className={classNames(
                      CLASSES.TEXT_MUTED,
                      CLASSES.SECTION_HEADER_SUB_TITLE,
                    )}
                  >
                    {subtitle}
                  </div>
                )}
              </div>
            </div>
            {isHeaderRightContainerVisible && (
              <div className={CLASSES.SECTION_HEADER_RIGHT}>
                {rightElement}
                {collapsible &&
                  (isCollapsed ? (
                    <Icon
                      icon={'chevron-down'}
                      className={CLASSES.TEXT_MUTED}
                    />
                  ) : (
                    <Icon icon={'chevron-up'} className={CLASSES.TEXT_MUTED} />
                  ))}
              </div>
            )}
          </div>
        )}
        {collapsible ? (
          // @ts-ignore
          <Collapse isOpen={!isCollapsed}>
            {children}
          </Collapse>
        ) : (
          children
        )}
      </Card>
    );
  },
);
Section.defaultProps = {
  compact: false,
  elevation: Elevation.ZERO,
};
Section.displayName = `${DISPLAYNAME_PREFIX}.Section`;
