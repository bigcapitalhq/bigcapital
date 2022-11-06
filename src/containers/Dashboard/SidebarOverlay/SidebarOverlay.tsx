// @ts-nocheck
import React from 'react';
import { Overlay, OverlayProps } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { SidebarOverlayContainer } from './SidebarOverlayContainer';
import { ISidebarMenuItem, ISidebarMenuItemType } from '../Sidebar/interfaces';

export interface ISidebarOverlayItem {
  text: string;
  href: string;
  divider?: boolean;
  label?: boolean;
}

export interface ISidebarOverlayProps {
  items: ISidebarMenuItem[];
}

export interface ISidebarOverlayItemProps {
  text: string | JSX.Element;
  href: string;
  onClick?: any;
}

export interface ISidebarOverlayItemDivider {
  divider: boolean;
}

/**
 * Sidebar overlay item.
 * @param   {ISidebarOverlayItemProps}
 * @returns {JSX.Element}
 */
export function SidebarOverlayItemLink({
  text,
  href,
  onClick,
}: ISidebarOverlayItemProps) {
  return (
    <div className="sidebar-overlay__item">
      <Link to={href} onClick={onClick}>
        {text}
      </Link>
    </div>
  );
}

export interface ISidebarOverlayItemLabel {
  text: string;
}

/**
 * Sidebar overlay label item.
 * @param   {ISidebarOverlayItemLabel}
 * @returns {JSX.Element}
 */
export function SidebarOverlayLabel({
  text,
}: ISidebarOverlayItemLabel): JSX.Element {
  return <div className="sidebar-overlay__label">{text}</div>;
}

/**
 * Sidebar overlay divider item.
 * @returns {JSX.Element}
 */
export function SidebarOverlayDivider() {
  return <div className={'sidebar-overlay__divider'}></div>;
}

interface SidebarOverlayItemProps {
  item: ISidebarMenuItem;
}

/**
 * Sidebar overlay item.
 * @param   {SidebarOverlayItemProps} props -
 * @returns {JSX.Element}
 */
function SidebarOverlayItem({ item }: SidebarOverlayItemProps) {
  //
  return item.type === ISidebarMenuItemType.Group ? (
    <SidebarOverlayLabel text={item.text} />
  ) : //
  item.type === ISidebarMenuItemType.Link ||
    item.type === ISidebarMenuItemType.Dialog ? (
    <SidebarOverlayItemLink text={item.text} href={item.href} onClick={item.onClick} />
  ) : null;
}

/**
 *
 */
export interface ISidebarOverlayMenu {
  items: ISidebarMenuItem[];
}

/**
 * Sidebar overlay menu.
 * @param   {ISidebarOverlayMenu}
 * @returns {JSX.Element}
 */
function SidebarOverlayMenu({ items }: ISidebarOverlayMenu) {
  return (
    <div className="sidebar-overlay__menu">
      {items.map((item) => (
        <SidebarOverlayItem item={item} />
      ))}
    </div>
  );
}

export interface SidebarOverlayProps extends OverlayProps {
  items: ISidebarMenuItem[];
}

/**
 * Sidebar overlay component.
 * @param   {SidebarOverlayProps}
 * @returns {JSX.Element}
 */
export function SidebarOverlay({ items, label, ...rest }: SidebarOverlayProps) {
  return (
    <Overlay
      portalContainer={
        (document.querySelector('.Pane.vertical.Pane2') as HTMLElement) ||
        document.body
      }
      transitionDuration={100}
      backdropClassName={'sidebar-overlay-backdrop'}
      {...rest}
    >
      <div className="sidebar-overlay sidebar-overlay-transition">
        <SidebarOverlayContainer>
          {label && <SidebarOverlayLabel text={label} />}

          <SidebarOverlayMenu items={items} />
        </SidebarOverlayContainer>
      </div>
    </Overlay>
  );
}
