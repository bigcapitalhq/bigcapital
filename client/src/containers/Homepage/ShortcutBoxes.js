import React from 'react';
import { shortcutBox } from 'common/homepageOptions';
import { Icon } from 'components';

function ShortcutBox({ title, iconColor, description }) {
  return (
    <div className={'shortcut-box'}>
      <a href={'#'}>
        <div className={'shortcut-box__header'}>
          <span
            className={'header--icon'}
            style={{ backgroundColor: `${iconColor}` }}
          >
            <Icon icon={'clock'} iconSize={24} />
          </span>
          <span>
            <Icon icon={'arrow-top-right'} iconSize={24} />
          </span>
        </div>
        <div className={'shortcut-box__title'}>{title}</div>
        <div className={'shortcut-box__description'}>{description}</div>
      </a>
    </div>
  );
}

function ShortcutBoxes() {
  return (
    <section className={'shortcut-boxes'}>
      {shortcutBox.map(({ title, description, iconColor }) => {
        return (
          <ShortcutBox
            title={title}
            description={description}
            iconColor={iconColor}
          />
        );
      })}
    </section>
  );
}

export default ShortcutBoxes;
