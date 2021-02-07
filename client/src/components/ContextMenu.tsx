/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

// import classNames from 'classnames';
import * as React from "react";
import * as ReactDOM from "react-dom";
// import { polyfill } from "react-lifecycles-compat";

import {
    Popover,
    Classes,
    Position,
} from '@blueprintjs/core';


// import { IOverlayLifecycleProps } from "../overlay/overlay";
// import { Popover } from "../popover/popover";
// import { PopperModifiers } from "../popover/popoverSharedProps";

export interface IOffset {
    left: number;
    top: number;
}

interface IContextMenuState {
    isOpen: boolean;
    isDarkTheme: boolean;
    menu?: JSX.Element;
    offset?: IOffset;
    onClose?: () => void;
}

const POPPER_MODIFIERS = {
    preventOverflow: { boundariesElement: "viewport" },
};
const TRANSITION_DURATION = 100;

// type IContextMenuProps = IOverlayLifecycleProps;

/* istanbul ignore next */

export default class ContextMenu extends React.PureComponent {
    public state: IContextMenuState = {
        isDarkTheme: false,
        isOpen: false,
    };

    public render() {
        // prevent right-clicking in a context menu
        const content = <div onContextMenu={this.cancelContextMenu}>{this.state.menu}</div>;
        const popoverClassName = {};

        // HACKHACK: workaround until we have access to Popper#scheduleUpdate().
        // https://github.com/palantir/blueprint/issues/692
        // Generate key based on offset so a new Popover instance is created
        // when offset changes, to force recomputing position.
        const key = this.state.offset === undefined ? "" : `${this.state.offset.left}x${this.state.offset.top}`;

        // wrap the popover in a positioned div to make sure it is properly
        // offset on the screen.
        return (
            <div className={Classes.CONTEXT_MENU_POPOVER_TARGET} style={this.state.offset}>
                <Popover
                    {...this.props}
                    backdropProps={{ onContextMenu: this.handleBackdropContextMenu }}
                    content={content}
                    enforceFocus={false}
                    key={key}
                    hasBackdrop={true}
                    isOpen={this.state.isOpen}
                    minimal={true}
                    // modifiers={POPPER_MODIFIERS}
                    onInteraction={this.handlePopoverInteraction}
                    position={Position.RIGHT_TOP}
                    // popoverClassName={popoverClassName}
                    target={<div />}
                    transitionDuration={TRANSITION_DURATION}
                />
            </div>
        );
    
    }

    public show(menu: JSX.Element, offset: IOffset, onClose?: () => void, isDarkTheme = false) {
        this.setState({ isOpen: true, menu, offset, onClose, isDarkTheme });
    }

    public hide() {
        this.state.onClose?.();
        this.setState({ isOpen: false, onClose: undefined });
    }

    private cancelContextMenu = (e: React.SyntheticEvent<HTMLDivElement>) => e.preventDefault();

    private handleBackdropContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        // React function to remove from the event pool, useful when using a event within a callback
        e.persist();
        e.preventDefault();
        // wait for backdrop to disappear so we can find the "real" element at event coordinates.
        // timeout duration is equivalent to transition duration so we know it's animated out.
        setTimeout(() => {
            // retrigger context menu event at the element beneath the backdrop.
            // if it has a `contextmenu` event handler then it'll be invoked.
            // if it doesn't, no native menu will show (at least on OSX) :(
            const newTarget = document.elementFromPoint(e.clientX, e.clientY);
            const { view, ...newEventInit } = e;
            newTarget?.dispatchEvent(new MouseEvent("contextmenu", newEventInit));
        }, TRANSITION_DURATION);
    };

    private handlePopoverInteraction = (nextOpenState: boolean) => {
        if (!nextOpenState) {
            // delay the actual hiding till the event queue clears
            // to avoid flicker of opening twice
            this.hide();
        }
    };
}