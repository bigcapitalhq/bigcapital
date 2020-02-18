import React from 'react';
import appMeta from 'config/app';

export default function() {
  return (
    <div className="sidebar__head">
      <div className="sidebar__head-logo">

      </div>

      <div className="sidebar__head-company-meta">
        <div className="comapny-name">
          { appMeta.app_name } 
        </div>

        <div className="company-meta">
          <span class="version">
          { appMeta.app_version }
          </span>
        </div>
      </div>
    </div>
  );
};