import React from 'react';
import appMeta from 'config/app';
import Icon from 'components/Icon';
export default function() {
  return (
    <div className="sidebar__head">
      <div className="sidebar__head-logo">
        <Icon icon={'bigcapital'} width={140} height={28} className="bigcapital--alt" />
      </div>
    </div>
  );
};