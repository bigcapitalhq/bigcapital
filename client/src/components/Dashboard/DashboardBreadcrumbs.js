import React from 'react';
import {
  CollapsibleList,
  MenuItem,
  Classes,
  Boundary,
} from '@blueprintjs/core';
import classNames from 'classnames';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import routes from 'routes/dashboard';

function DashboardBreadcrumbs({breadcrumbs}){

  const renderBreadcrumb =(props)=>{

    if(props.href != null){

    return <a className={Classes.BREADCRUMB}>{props.text}</a>;
    }else{

      return(
        <span
        className={classNames(Classes.BREADCRUMB, Classes.BREADCRUMB_CURRENT)}>

          {props.text}
        </span>
      )
    }
  }
  return(
<CollapsibleList
   className={Classes.BREADCRUMBS}
   dropdownTarget={<span className={Classes.BREADCRUMBS_COLLAPSED} />}
   visibleItemRenderer={renderBreadcrumb}
   collapseFrom={Boundary.START}
   visibleItemCount={0}>

     {
       breadcrumbs.map(({breadcrumb,match},index)=>{

        return <MenuItem key={match.url} icon={'folder-close'} text={breadcrumb} href={match.url} />
       })
     }
</CollapsibleList>

  )
}

export default withBreadcrumbs(routes)(DashboardBreadcrumbs)
