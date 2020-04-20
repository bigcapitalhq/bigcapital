import * as React from 'react';
import { Scrollbar } from 'react-scrollbars-custom';

const style = {
  holder: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },

  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  content: {
    boxSizing: 'border-box',
  },

  track: {
    common: {
      position: 'absolute',
      overflow: 'hidden',
      borderRadius: 4,
      background: 'rgba(0,0,0,.1)',
      userSelect: 'none',
    },
    x: {
      height: 10,
      width: 'calc(100% - 20px)',
      bottom: 0,
      left: 10,
    },
    y: {
      width: 10,
      height: 'calc(100% - 20px)',
      top: 10,
    },
  },

  thumb: {
    common: {
      cursor: 'pointer',
      borderRadius: 4,
      background: 'rgba(0,0,0,.4)',
    },
    x: {
      height: '100%',
      width: 0,
    },
    y: {
      width: '100%',
      height: 0,
    },
  },
};

export default function SidebarContainer(props) {
  return (
    <div className='sidebar' id='sidebar'>
      {/* <div className='sidebar__inner'>{props.children}</div> */}
      <Scrollbar noDefaultStyles={true}>
        <div className='sidebar__inner'>{props.children}</div>
      </Scrollbar>
    </div>
  );
}
