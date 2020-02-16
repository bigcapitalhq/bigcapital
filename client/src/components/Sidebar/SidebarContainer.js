import React from 'react';

export default function SidebarContainer(props) {
  return (
    <div className="sidebar" id="sidebar">
      {props.children}
    </div>
  )
}