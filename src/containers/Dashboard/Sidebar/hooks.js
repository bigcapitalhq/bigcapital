import _, { isEmpty } from 'lodash';
import React from 'react';
import deepdash from 'deepdash';
import * as R from 'ramda';
import { useHistory } from 'react-router-dom';

import { useAbilityContext } from 'hooks';
import { useSidebarSubmenu } from 'hooks/state';
import { SidebarMenu } from 'config/sidebarMenu';
import { ISidebarMenuItemType } from './interfaces';
import { useSidebarSubmnuActions, useDialogActions } from 'hooks/state';

const deep = deepdash(_);

const deepDashConfig = {
  childrenPath: 'children',
  pathFormat: 'array',
};

/**
 *
 * @param  {*} menu
 * @returns
 */
function removeSidebarOverlayChildren(menu) {
  return deep.mapValuesDeep(
    menu,
    (item, key, parent, context) => {
      if (item.type === ISidebarMenuItemType.Overlay) {
        context.skipChildren(true);
        return _.omit(item, ['children']);
      }
      return item;
    },
    deepDashConfig,
  );
}

/**
 * Retrives the main sidebar pre-menu.
 * @returns
 */
export function getMainSidebarMenu() {
  return R.compose(removeSidebarOverlayChildren)(SidebarMenu);
}

/**
 * Retrieves the sub sidebar pre-menu.
 */
export function getSubSidebarMenu() {}

/**
 *
 * @param {*} menu
 * @returns
 */
function useFilterSidebarMenuAbility(menu) {
  const ability = useAbilityContext();

  return deep.filterDeep(
    menu,
    (item) => {
      return (
        (item.permission &&
          ability.can(item.permission.ability, item.permission.subject)) ||
        !item.permission
      );
    },
    deepDashConfig,
  );
}

/**
 * Flats the sidebar menu groups.
 * @param   {*} menu
 * @returns {}
 */
function useFlatSidebarMenu(menu) {
  return React.useMemo(() => {
    return deep.mapDeep(menu, (item) => item, deepDashConfig);
  }, [menu]);
}

/**
 *
 * @param  {*} menu
 * @returns
 */
function useBindSidebarItemLinkClick(menu) {
  const history = useHistory();
  const { toggleSidebarSubmenu, closeSidebarSubmenu } =
    useSidebarSubmnuActions();

  const { openDialog } = useDialogActions();

  // Handle sidebar item click.
  const handleClick = (item) => (event) => {
    closeSidebarSubmenu();

    //
    if (item.type === ISidebarMenuItemType.Overlay) {
      toggleSidebarSubmenu({ submenuId: item.overlayId });
      //
    } else if (item.type === ISidebarMenuItemType.Link) {
      history.push(item.href);
    } else if (item.type === ISidebarMenuItemType.Dialog) {
      openDialog(item.dialogName, item.dialogPayload);
    }
  };
  return React.useMemo(() => {
    return deep.mapValuesDeep(
      menu,
      (item) => {
        return {
          ...item,
          onClick: handleClick(item),
        };
      },
      deepDashConfig,
    );
  }, [menu]);
}

/**
 *
 */
const findSubmenuBySubmenuId = R.curry((submenuId, menu) => {
  const groupItem = deep.findDeep(
    menu,
    (item) => {
      return (
        item.type === ISidebarMenuItemType.Overlay &&
        item.overlayId === submenuId
      );
    },
    deepDashConfig,
  );
  return groupItem?.value?.children || [];
});

/**
 * Retrieves the main sidebar post-menu.
 */
export function useMainSidebarMenu() {
  return R.compose(
    useBindSidebarItemLinkClick,
    useFlatSidebarMenu,

    removeSidebarOverlayChildren,
    useAssocSidebarItemHasChildren,
    useFilterSidebarMenuAbility,
  )(SidebarMenu);
}

/**
 * Assoc `hasChildren` prop to sidebar menu items.
 * @param {*} items
 * @returns
 */
function useAssocSidebarItemHasChildren(items) {
  return deep.mapValuesDeep(
    items,
    (item) => {
      return {
        ...item,
        hasChildren: !isEmpty(item.children),
      };
    },
    deepDashConfig,
  );
}

/**
 * Retrieves the sub-sidebar post-menu.
 * @param {*} submenuId
 * @returns
 */
export function useSubSidebarMenu(submenuId) {
  if (!submenuId) return [];

  return R.compose(
    useBindSidebarItemLinkClick,
    useFlatSidebarMenu,
    useFilterSidebarMenuAbility,
    findSubmenuBySubmenuId(submenuId),
  )(SidebarMenu);
}

/**
 * Observes the sidebar expending with body class.
 * @param {boolean} sidebarExpended
 */
export function useObserveSidebarExpendedBodyclass(sidebarExpended) {
  React.useEffect(() => {
    document.body.classList.toggle('has-mini-sidebar', !sidebarExpended);
  }, [sidebarExpended]);
}

/**
 * Detamrines whether the given sidebar menu item is active.
 * @returns {boolean}
 */
export function useIsSidebarMenuItemActive(item) {
  const { submenuId } = useSidebarSubmenu();

  return (
    item.type === ISidebarMenuItemType.Overlay && submenuId === item.overlayId
  );
}
