/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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
import {
  Classes,
  DISPLAYNAME_PREFIX,
  Popover,
  Position,
  Utils,
  InputGroup,
  Button,
  refHandler,
} from '@blueprintjs/core';
import { QueryList } from '@blueprintjs/select';

// export interface IMultiSelectProps<T> extends IListItemsProps<T> {
//     /**
//      * Whether the component should take up the full width of its container.
//      * This overrides `popoverProps.fill` and `tagInputProps.fill`.
//      */
//     fill?: boolean;

//     /**
//      * Whether the popover opens on key down or when `TagInput` is focused.
//      * @default false
//      */
//     openOnKeyDown?: boolean;

//     /**
//      * Input placeholder text. Shorthand for `tagInputProps.placeholder`.
//      * @default "Search..."
//      */
//     placeholder?: string;

//     /** Props to spread to `Popover`. Note that `content` cannot be changed. */
//     popoverProps?: Partial<IPopoverProps> & object;

//     /** Controlled selected values. */
//     selectedItems?: T[];

//     /** Props to spread to `TagInput`. Use `query` and `onQueryChange` to control the input. */
//     tagInputProps?: Partial<ITagInputProps> & object;

//     /** Custom renderer to transform an item into tag content. */
//     tagRenderer: (item: T) => React.ReactNode;
// }

// export interface IMultiSelectState {
//     isOpen: boolean;
// }

export class MultiSelect extends React.Component {
  inputElement = null;
  handleInputRef = refHandler(
    this,
    'inputElement',
    this.props.inputProps?.inputRef,
  );

  static get displayName() {
    return `${DISPLAYNAME_PREFIX}.MultiSelect`;
  }

  static get defaultProps() {
    return {
      fill: false,
      placeholder: 'Search...',
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      isOpen:
        (this.props.popoverProps && this.props.popoverProps.isOpen) || false,
    };
    this.input = null;
    this.queryList = null;
    this.listRef = React.createRef();

    this.refHandlers = {
      queryList: (ref) => {
        this.queryList = ref;
      },
    };
  }

  render() {
    // omit props specific to this component, spread the rest.
    const { openOnKeyDown, popoverProps, ...restProps } = this.props;

    return (
      <QueryList
        {...restProps}
        onItemSelect={this.handleItemSelect.bind(this)}
        onQueryChange={this.handleQueryChange.bind(this)}
        ref={this.refHandlers.queryList}
        renderer={this.renderQueryList.bind(this)}
      />
    );
  }

  maybeRenderClearButton(query) {
    return query.length > 0 ? (
      <Button icon="cross" minimal={true} onClick={this.resetQuery} />
    ) : undefined;
  }

  renderQueryList(listProps) {
    const { filterable, fill, inputProps = {}, popoverProps = {} } = this.props;
    const { handleKeyDown, handleKeyUp } = listProps;

    if (fill) {
      popoverProps.fill = true;
    }

    // const handleInputRef = refHandler(
    //   this,
    //   'inputElement',
    //   this.props.inputProps?.inputRef,
    // );

    const input = (
      <InputGroup
        leftIcon="search"
        placeholder="Filter..."
        rightElement={this.maybeRenderClearButton(listProps.query)}
        {...inputProps}
        inputRef={this.handleInputRef}
        onChange={listProps.handleQueryChange}
        value={listProps.query}
      />
    );

    return (
      <Popover
        autoFocus={false}
        canEscapeKeyClose={true}
        enforceFocus={false}
        isOpen={this.state.isOpen}
        position={Position.BOTTOM_LEFT}
        {...popoverProps}
        className={classNames(listProps.className, popoverProps.className)}
        onInteraction={this.handlePopoverInteraction.bind(this)}
        popoverClassName={classNames(
          Classes.MULTISELECT_POPOVER,
          popoverProps.popoverClassName,
        )}
        onOpened={this.handlePopoverOpened.bind(this)}
      >
        <div
          onKeyDown={
            this.state.isOpen ? handleKeyDown : this.handleTargetKeyDown
          }
          onKeyUp={this.state.isOpen ? handleKeyUp : undefined}
        >
          {this.props.children}
        </div>
        <div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} ref={this.listRef}>
          {filterable ? input : undefined}
          {listProps.itemList}
        </div>
      </Popover>
    );
  }

  handleItemSelect(item, evt) {
    if (this.input != null) {
      this.input.focus();
    }
    Utils.safeInvoke(this.props.onItemSelect, item, evt);
  }

  handleQueryChange(query, evt) {
    this.setState({ isOpen: query.length > 0 || !this.props.openOnKeyDown });
    Utils.safeInvoke(this.props.onQueryChange, query, evt);
  }

  handlePopoverInteraction = (isOpen, e) => {
    if (e && this.listRef.current && this.listRef.current.contains(e.target)) {
      this.setState({ isOpen: true });
    } else {
      this.setState({ isOpen });
    }
    Utils.safeInvokeMember(this.props.popoverProps, 'onInteraction', isOpen);
  };

  handlePopoverOpened(node) {
    if (this.queryList != null) {
      // scroll active item into view after popover transition completes and all dimensions are stable.
      this.queryList.scrollActiveItemIntoView();
    }
    requestAnimationFrame(() => {
      const { inputProps = {} } = this.props;
      // autofocus is enabled by default
      if (inputProps.autoFocus !== false) {
        this.inputElement.focus();
      }
    });
    Utils.safeInvokeMember(this.props.popoverProps, 'onOpened', node);
  }

  resetQuery = () => this.queryList && this.queryList.setQuery('', true);
}
