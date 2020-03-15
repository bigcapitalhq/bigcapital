import React from 'react';
import {
  CollapsibleList,
  MenuItem,
  Classes,
  Boundary,
} from "@blueprintjs/core";
import classNames from "classnames";

export default function DashboardBreadcrumbs() {

  function renderBreadcrumb(props) {
    if (props.href != null) {
      return <a className={Classes.BREADCRUMB}>{props.text}</a>;
    } else {
      return <span className={classNames(Classes.BREADCRUMB, Classes.BREADCRUMB_CURRENT)}>{props.text}</span>;
    }
  }
  return (
    <CollapsibleList
      className={Classes.BREADCRUMBS}
      dropdownTarget={<span className={Classes.BREADCRUMBS_COLLAPSED} />}
      visibleItemRenderer={renderBreadcrumb}
      collapseFrom={Boundary.START}
      visibleItemCount={0}
    >
      <MenuItem icon="folder-close" text="All files" href="#" />
      <MenuItem icon="folder-close" text="Users" href="#" />
      <MenuItem icon="folder-close" text="Jane Person" href="#" />
      <MenuItem icon="folder-close" text="My documents" href="#" />
      <MenuItem icon="folder-close" text="Classy dayjob" href="#" />
      <MenuItem icon="document" text="How to crush it" />
  </CollapsibleList>
  );
}