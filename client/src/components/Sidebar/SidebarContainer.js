import * as React from 'react';
import { Scrollbar } from 'react-scrollbars-custom';

export default function SidebarContainer(props) {
  return (
    <div className='sidebar' id='sidebar'>
      <Scrollbar noDefaultStyles={true}>
        <div className='sidebar__inner'>{props.children}</div>
      </Scrollbar>
    </div>
  );
}
