import React from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import classNames from 'classnames';

import { announcementLists } from 'common/homepageOptions';

function AnnouncementBox({ title, description }) {
  return (
    <div className={'announcement-box'}>
      <div className={'announcement-box__title'}>{title}</div>
      <div className={'announcement-box__description'}>{description}</div>
    </div>
  );
}

function AnnouncementList() {
  return (
    <section className={'announcements-list'}>
      <div className={'announcements-list__title'}>Announcement</div>

      {announcementLists.map(({ title, description }) => (
        <AnnouncementBox title={title} description={description} />
      ))}

      <a href={'#'} className={'btn-view-all'}>
        <T id={'view_all'} />
      </a>
    </section>
  );
}

export default AnnouncementList;
