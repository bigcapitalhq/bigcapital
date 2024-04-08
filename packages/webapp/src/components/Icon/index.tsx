
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import classNames from 'classnames';
import * as React from 'react';
import { Classes, Props } from '@blueprintjs/core';
import IconSvgPaths from '@/static/json/icons';
import PropTypes from 'prop-types';
export interface IconProps extends Props {
  color?: string;
  htmlTitle?: string;
  icon: IconName | MaybeElement;
  iconSize?: number;
  style?: object;
  tagName?: keyof JSX.IntrinsicElements;
  title?: string;
}

export class Icon extends React.Component<IconProps> {
  static displayName = `af.Icon`;

  static SIZE_STANDARD = 16;
  static SIZE_LARGE = 20;

  render() {
    const { icon } = this.props;
    if (icon == null || typeof icon === 'boolean') {
      return null;
    } else if (typeof icon !== 'string') {
      return icon;
    }

    const {
      className,
      color,
      htmlTitle,
      iconSize = Icon.SIZE_STANDARD,
      height,
      width,
      intent,
      title = icon,
      tagName = 'span',
      ...htmlprops
    } = this.props;

    // choose which pixel grid is most appropriate for given icon size
    const pixelGridSize = iconSize >= Icon.SIZE_LARGE ? Icon.SIZE_LARGE : Icon.SIZE_STANDARD;
    const iconPath = this.getSvgPath(icon);

    if (!iconPath) {
      return null;
    }

    // render path elements, or nothing if icon name is unknown.
    const paths = this.renderSvgPaths(iconPath.path);

    const classes = classNames(Classes.ICON, Classes.iconClass(icon), Classes.intentClass(intent), className);
    const viewBox = iconPath.viewBox;

    const computedHeight = height || iconSize;
    const computedWidth = width || iconSize;

    return React.createElement(
      tagName,
      {
        ...htmlprops,
        className: classes,
        title: htmlTitle,
      },
      <svg fill={color} data-icon={icon} width={computedWidth} height={computedHeight} viewBox={viewBox}>
        {title && <desc>{title}</desc>}
        {paths}
      </svg>,
    );
  }

  getSvgPath(iconName) {
    const svgPathsRecord = IconSvgPaths;
    const pathStrings = svgPathsRecord[iconName];

    return pathStrings;
  }

  /** Render `<path>` elements for the given icon name. Returns `null` if name is unknown. */
  renderSvgPaths(pathStrings) {
    if (pathStrings == null) {
      return null;
    }
    return pathStrings.map((d, i) => <path key={i} d={d} className={`path-${i + 1}`} fillRule="evenodd" />);
  }
}

Icon.propTypes = {
  /**
   * Color of icon. This is used as the `fill` attribute on the `<svg>` image
   * so it will override any CSS `color` property, including that set by
   * `intent`. If this prop is omitted, icon color is inherited from
   * surrounding text.
   */
  color: PropTypes.string,

  /**
   * String for the `title` attribute on the rendered element, which will appear
   * on hover as a native browser tooltip.
   */
  htmlTitle: PropTypes.string,

  /**
   * Name of a Blueprint UI icon, or an icon element, to render. This prop is
   * required because it determines the content of the component, but it can
   * be explicitly set to falsy values to render nothing.
   *
   * - If `null` or `undefined` or `false`, this component will render
   *   nothing.
   * - If given an `IconName` (a string literal union of all icon names), that
   *   icon will be rendered as an `<svg>` with `<path>` tags. Unknown strings
   *   will render a blank icon to occupy space.
   * - If given a `JSX.Element`, that element will be rendered and _all other
   *   props on this component are ignored._ This type is supported to
   *   simplify icon support in other Blueprint components. As a consumer, you
   *   should avoid using `<Icon icon={<Element />}` directly; simply render
   *   `<Element />` instead.
   */
  // icon: IconName | MaybeElement;

  /**
   * Size of the icon, in pixels. Blueprint contains 16px and 20px SVG icon
   * images, and chooses the appropriate resolution based on this prop.
   * @default Icon.SIZE_STANDARD = 16
   */
  iconSize: PropTypes.number,

  /** CSS style properties. */
  style: PropTypes.object,

  /**
   * HTML tag to use for the rendered element.
   * @default "span"
   */
  // tagName?: keyof JSX.IntrinsicElements

  /**
   * Description string. This string does not appear in normal browsers, but
   * it increases accessibility. For instance, screen readers will use it for
   * aural feedback. By default, this is set to the icon's name. Pass an
   * explicit falsy value to disable.
   */
  title: PropTypes.string,
};
