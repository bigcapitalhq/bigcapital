import React from 'react';
import { Overlay } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import SidebarOverlayContainer from './SidebarOverlayContainer';

interface ISidebarOverlayItem {
  text: string;
  href: string;
  divider?: boolean;
  label?: boolean
}

interface ISidebarOverlayProps {
  isOpen: boolean;
  items: ISidebarOverlayItem[];
  overlayProps: any;
  overlayContainerRef: any;
}

interface ISidebarOverlayItemProps {
  text: string;
  href: string;
}

interface ISidebarOverlayItemDivider {
  divider: boolean;
}
/**
 * Sidebar overlay item.
 */
function SidebarOverlayItem({ text, href }: ISidebarOverlayItemProps) {
  return (
    <div className="sidebar-overlay__item">
      <Link to={href}>{text}</Link>
    </div>
  );
}

interface ISidebarOverlayItemLabel {
	text: string;
}

function SidebarOverlayLabel({ text }: ISidebarOverlayItemLabel) {
  return <div className="sidebar-overlay__label">{text}</div>;
}

function SidebarOverlayDivider() {
  return <div className={'sidebar-overlay__divider'}></div>;
}

/**
 * Sidebar overlay component.
 */
export default function SidebarOverlay({
  isOpen = false,
  items,
}: ISidebarOverlayProps) {
  //
  if (!isOpen) {
    return '';
  }

  const handleOverlayClose = () => {
	
  };

  return (
    <Overlay
      isOpen={isOpen}
      portalContainer={document.getElementById('dashboard') || document.body}
	  onClose={handleOverlayClose}
    >
      <div className="sidebar-overlay">
        <SidebarOverlayContainer>
          <div className="sidebar-overlay__menu">
            {items.map((item) =>
              item.divider ? (
                <SidebarOverlayDivider />
              ) : item.label ? (
                <SidebarOverlayLabel text={item.text} />
              ) : (
                <SidebarOverlayItem text={item.text} href={item.href} />
              ),
            )}
          </div>
        </SidebarOverlayContainer>
      </div>
    </Overlay>
  );
}
