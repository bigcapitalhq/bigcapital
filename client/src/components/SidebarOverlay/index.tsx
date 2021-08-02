import React from 'react';
import { Overlay } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import SidebarOverlayContainer from './SidebarOverlayContainer';
interface ISidebarOverlayItem {
  text: string;
  href: string;
  divider?: boolean;
  label?: boolean;
}

interface ISidebarOverlayProps {
  isOpen: boolean;
  items: ISidebarOverlayItem[];
  label: string;
  onClose: Function;
}

interface ISidebarOverlayItemProps {
  text: string;
  href: string;
  onLinkClick: Function;
}

interface ISidebarOverlayItemDivider {
  divider: boolean;
}
/**
 * Sidebar overlay item.
 */
function SidebarOverlayItem({
  text,
  href,
  onLinkClick,
}: ISidebarOverlayItemProps) {
  const handleLinkClick = () => {
    onLinkClick && onLinkClick();
  };
  return (
    <div className="sidebar-overlay__item">
      <Link onClick={handleLinkClick} to={href}>
        {text}
      </Link>
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
  label,
  isOpen: controllerdIsOpen,
  onClose,
  items,
}: ISidebarOverlayProps) {
  const [isEverOpened, setEverOpened] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(controllerdIsOpen);

  React.useEffect(() => {
    if (controllerdIsOpen && isOpen !== controllerdIsOpen) {
      setIsOpen(controllerdIsOpen);
    }
  }, [controllerdIsOpen, setIsOpen, isOpen]);

  React.useEffect(() => {
    if (isOpen && !isEverOpened) {
      setEverOpened(true);
    }
  }, [isEverOpened, isOpen]);

  if (!isEverOpened) {
    return '';
  }

  // Handle overlay close event.
  const handleOverlayClose = () => {
    setIsOpen(false);
    onClose && onClose();
  };
  // Handle overlay open event.
  const handleOverlayOpen = () => {
    setIsOpen(true);
  };
  // Handle sidebar item link click.
  const handleItemClick = () => {
    setIsOpen(false);
    onClose && onClose();
  };

  return (
    <Overlay
      isOpen={isOpen}
      portalContainer={document.getElementById('dashboard') || document.body}
      onClose={handleOverlayClose}
      onOpening={handleOverlayOpen}
      transitionDuration={200}
      backdropClassName={'sidebar-overlay-backdrop'}
    >
      <div className="sidebar-overlay sidebar-overlay-transition">
        <SidebarOverlayContainer>
          <div className="sidebar-overlay__menu">
            {label && (
              <>
                <SidebarOverlayLabel text={label} />
                <SidebarOverlayDivider />
              </>
            )}

            {items.map((item) =>
              item.divider ? (
                <SidebarOverlayDivider />
              ) : item.label ? (
                <SidebarOverlayLabel text={item.text} />
              ) : (
                <SidebarOverlayItem
                  onLinkClick={handleItemClick}
                  text={item.text}
                  href={item.href}
                />
              ),
            )}
          </div>
        </SidebarOverlayContainer>
      </div>
    </Overlay>
  );
}
