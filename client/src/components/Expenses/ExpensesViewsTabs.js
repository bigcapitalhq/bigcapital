// import React from 'react';
// import {useHistory} from 'react-router';
// import {connect} from 'react-redux';
// import {
//   Alignment,
//   Navbar,
//   NavbarGroup,
//   Tabs,
//   Tab,
//   Button
// } from "@blueprintjs/core";
// import Icon from 'components/Icon';
// import {useRouteMatch, Link} from 'react-router-dom';

// function AccountsViewsTabs({ views }) {
//   const history = useHistory();
//   const {path} = useRouteMatch();

//   const handleClickNewView = () => {
//     history.push('/custom_views/new');
//   };

//   const tabs = views.map((view) => {
//     const link = (<Link to={`${path}/${view.id}/custom_view`}>{ view.name }</Link>);
//     return (<Tab id={`custom_view_${view.id}`} title={link} />);
//   });
//   return (
//     <Navbar className="navbar--dashboard-views">
//       <NavbarGroup
//         align={Alignment.LEFT}>
//         <Tabs
//           id="navbar"
//           large={true}
//           className="tabs--dashboard-views"
//         >
//           { tabs }
//           <Button
//             className="button--new-view"
//             icon={<Icon icon="plus" />}
//             onClick={handleClickNewView} />
//         </Tabs>
//       </NavbarGroup>
//     </Navbar>
//   );
// }

// const mapStateToProps = (state) => ({
//   views: state.views.resourceViews['expenses'],
// });

// export default connect(mapStateToProps)(AccountsViewsTabs);