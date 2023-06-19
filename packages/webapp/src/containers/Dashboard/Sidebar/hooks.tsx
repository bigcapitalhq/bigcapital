// @ts-nocheck
import _, { isEmpty, includes } from 'lodash';
import React from 'react';
import * as R from 'ramda';
import { useHistory } from 'react-router-dom';

import { useAbilityContext } from '@/hooks';
import {
  useSidebarSubmnuActions,
  useDialogActions,
  useSubscription,
  useSidebarSubmenu,
  useFeatureCan,
} from '@/hooks/state';
import { SidebarMenu } from '@/constants/sidebarMenu';
import {
  ISidebarMenuItemType,
  ISidebarSubscriptionAbility,
} from './interfaces';
import { filterValuesDeep, deepdash } from '@/utils';

const deepDashConfig = {
  childrenPath: 'children',
  pathFormat: 'array',
};
const ignoreTypesEmpty = [
  ISidebarMenuItemType.Group,
  ISidebarMenuItemType.Overlay,
];

/**
 * Removes the all overlay items from the menu to the main-sidebar.
 * @param   {ISidebarMenuItem[]} menu
 * @returns {ISidebarMenuItem[]}
 */
function removeSidebarOverlayChildren(menu) {
  return deepdash.mapValuesDeep(
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
 * @returns {ISidebarMenuItem[]}
 */
export function getMainSidebarMenu() {
  return R.compose(removeSidebarOverlayChildren)(SidebarMenu);
}

/**
 * Predicates whether the sidebar item has feature ability.
 */
function useFilterSidebarItemFeaturePredicater() {
  const { featureCan } = useFeatureCan();

  return {
    // Returns false if the item has `feature` prop and that feature has no ability.
    predicate: (item) => {
      if (item.feature && !featureCan(item.feature)) {
        return false;
      }
      return true;
    },
  };
}

/**
 * Predicates whether the sidebar item has permissio ability.
 */
function useFilterSidebarItemAbilityPredicater() {
  const ability = useAbilityContext();

  return {
    // Retruns false if the item has `permission` prop and that permission has no ability.
    predicate: (item) => {
      if (
        item.permission &&
        !ability.can(item.permission.ability, item.permission.subject)
      ) {
        return false;
      }
      return true;
    },
  };
}

/**
 * Filters the sidebar item based on the subscription state.
 */
function useFilterSidebarItemSubscriptionPredicater() {
  const { isSubscriptionActive, isSubscriptionInactive } = useSubscription();

  return {
    predicate: (item) => {
      const { subscription } = item;

      if (subscription) {
        const isActive = includes(subscription, [
          ISidebarSubscriptionAbility.Active,
        ])
          ? isSubscriptionActive
          : true;

        const isInactive = includes(subscription, [
          ISidebarSubscriptionAbility.Inactive,
        ])
          ? isSubscriptionInactive
          : true;

        return isActive && isInactive;
      }
      return true;
    },
  };
}

/**
 * Filters sidebar menu items based on ability of the item permission.
 * @param   {} menu
 * @returns {}
 */
function useFilterSidebarMenuAbility(menu) {
  const { predicate: predFeature } = useFilterSidebarItemFeaturePredicater();
  const { predicate: predAbility } = useFilterSidebarItemAbilityPredicater();
  const { predicate: predSubscription } =
    useFilterSidebarItemSubscriptionPredicater();

  return deepdash.filterDeep(
    menu,
    (item) => predFeature(item) && predAbility(item),
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
    return deepdash.mapDeep(menu, (item) => item, deepDashConfig);
  }, [menu]);
}

/**
 * Binds sidebar link item click action.
 * @param   {ISidebarMenuItem} item
 */
function useBindSidebarItemLinkClick() {
  const history = useHistory();
  const { closeSidebarSubmenu } = useSidebarSubmnuActions();

  // Handle sidebar item click.
  const onClick = (item) => (event) => {
    closeSidebarSubmenu();
    history.push(item.href);
  };
  return {
    bindOnClick: (item) => {
      return {
        ...item,
        onClick: onClick(item),
      };
    },
  };
}

/**
 * Bind sidebar dialog item click action.
 * @param   {ISidebarMenuItem} item
 */
function useBindSidebarItemDialogClick() {
  const { closeSidebarSubmenu } = useSidebarSubmnuActions();
  const { openDialog } = useDialogActions();

  // Handle sidebar item click.
  const onClick = (item) => (event) => {
    closeSidebarSubmenu();
    openDialog(item.dialogName, item.dialogPayload);
  };
  return {
    bindOnClick: (item) => {
      return {
        ...item,
        onClick: onClick(item),
      };
    },
  };
}

/**
 * Binds click action for the sidebar overlay item.
 */
function useBindSidebarItemOverlayClick() {
  const { toggleSidebarSubmenu, closeSidebarSubmenu } =
    useSidebarSubmnuActions();

  // Handle sidebar item click.
  const onClick = (item) => (event) => {
    closeSidebarSubmenu();
    toggleSidebarSubmenu({ submenuId: item.overlayId });
  };
  return {
    bindOnClick: (item) => {
      return {
        ...item,
        onClick: onClick(item),
      };
    },
  };
}

/**
 * Binds click action of the given sidebar menu for each item based on item type.
 */
function useBindSidebarItemClick(menu) {
  const { bindOnClick: bindLinkClickEvt } = useBindSidebarItemLinkClick();
  const { bindOnClick: bindOverlayClickEvt } = useBindSidebarItemOverlayClick();
  const { bindOnClick: bindItemDialogEvt } = useBindSidebarItemDialogClick();

  return React.useMemo(() => {
    return deepdash.mapValuesDeep(
      menu,
      (item) => {
        return R.compose(
          R.when(
            R.propSatisfies(R.equals(ISidebarMenuItemType.Link), 'type'),
            bindLinkClickEvt,
          ),
          R.when(
            R.propSatisfies(R.equals(ISidebarMenuItemType.Overlay), 'type'),
            bindOverlayClickEvt,
          ),
          R.when(
            R.propSatisfies(R.equals(ISidebarMenuItemType.Dialog), 'type'),
            bindItemDialogEvt,
          ),
        )(item);
      },
      deepDashConfig,
    );
  }, [menu]);
}

/**
 * Finds the given overlay submenu id from the menu graph.
 * @param   {ISidebarMenuOverlayIds}
 * @param   {ISidebarMenuItem[]} menu -
 * @returns {ISidebarMenuItem[]}
 */
const findSubmenuBySubmenuId = R.curry((submenuId, menu) => {
  const groupItem = deepdash.findDeep(
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
 * @returns {ISidebarMenuItem[]}
 */
export function useMainSidebarMenu() {
  return R.compose(
    useBindSidebarItemClick,
    useFlatSidebarMenu,
    removeSidebarOverlayChildren,
    useAssocSidebarItemHasChildren,
    filterSidebarItemHasNoChildren,
    useFilterSidebarMenuAbility,
  )(SidebarMenu);
}

/**
 * Assoc `hasChildren` prop to sidebar menu items.
 * @param   {ISidebarMenuItem[]} items
 * @returns {ISidebarMenuItem[]}
 */
function useAssocSidebarItemHasChildren(items) {
  return deepdash.mapValuesDeep(
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
 * @param   {ISidebarMenuOverlayIds} submenuId
 * @returns {ISidebarMenuItem[]}
 */
export function useSubSidebarMenu(submenuId) {
  if (!submenuId) return [];

  return R.compose(
    useBindSidebarItemClick,
    useFlatSidebarMenu,
    filterSidebarItemHasNoChildren,
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
 * Determines whether the given sidebar menu item is active.
 * @returns {boolean}
 */
export function useIsSidebarMenuItemActive(item) {
  const { submenuId } = useSidebarSubmenu();
  return (
    item.type === ISidebarMenuItemType.Overlay && submenuId === item.overlayId
  );
}

/**
 * Filter sidebar specific items types that have no types.
 * @param   {ISidebarMenuItem[]} items -
 * @returns {ISidebarMenuItem[]}
 */
export function filterSidebarItemHasNoChildren(items) {
  return filterValuesDeep((item) => {
    // If it was group item and has no children items so discard that item.
    if (ignoreTypesEmpty.indexOf(item.type) !== -1 && isEmpty(item.children)) {
      return false;
    }
    return true;
  }, items);
}
