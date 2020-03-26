import React from 'react';

export default function SidebarContainer(props) {
  return (
    <div className="sidebar" id="sidebar">
      <div class="sidebar__inner">
        {props.children}
      </div>
    </div>
  )
}