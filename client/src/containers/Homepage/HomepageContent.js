import React from 'react';
import ShortcutBoxes from './ShortcutBoxes';
import AnnouncementList from './AnnouncementList';

import 'style/pages/HomePage/HomePage.scss';

function HomepageContent() {
  return (
    <div className={'homepage__container'}>
      <ShortcutBoxes />
      <AnnouncementList />
    </div>
  );
}

export default HomepageContent;
