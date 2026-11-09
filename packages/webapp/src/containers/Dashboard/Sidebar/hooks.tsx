import * as FF from 'fp-ts/function';
import _, { isEmpty, includes } from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  ISidebarMenuItem,
  ISidebarMenuItemDialog,
  ISidebarMenuItemLink,
  ISidebarMenuItemOverlay,
  ISidebarMenuItemType,
  ISidebarSubscriptionAbility,
} from './interfaces';
import type { SidebarMenuItem } from '@/constants/sidebarMenu';
import { SidebarMenu } from '@/constants/sidebarMenu';
import { useAbilityContext } from '@/hooks';
import { useSubscription } from '@/hooks/query';
import {
  useSidebarSubmnuActions,
  useDialogActions,
  useSidebarSubmenu,
  useFeatureCan,
} from '@/hooks/state';
import { filterValuesDeep, deepdash } from '@/utils';

// deepdash's bundled typings wrongly require `childrenPath` to be an array of
// paths while its runtime accepts a single path string (`'children'`).
const deepDashConfig = {
  childrenPath: 'children',
  pathFormat: 'array',
} as unknown as Parameters<typeof deepdash.mapValuesDeep>[2];

const ingoreTypesEmpty = [
  ISidebarMenuItemType.Group,
  ISidebarMenuItemType.Overlay,
];

/**
 * Removes the all overlay items from the menu to the main-sidebar.
 * @param   {ISidebarMenuItem[]} menu
 * @returns {ISidebarMenuItem[]}
 */
function removeSidebarOverlayChildren(
  menu: Array<SidebarMenuItem | ISidebarMenuItem>,
): ISidebarMenuItem[] {
  return deepdash.mapValuesDeep(
    menu,
    (item: SidebarMenuItem | ISidebarMenuItem, key, parent, context) => {
      if (item.type === ISidebarMenuItemType.Overlay) {
        // `skipChildren` exists on deepdash's runtime iteratee context but is
        // missing from its bundled typings.
        const ctx = context as typeof context & {
          skipChildren: (skip: boolean) => void;
        };
        ctx.skipChildren(true);
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
export function getMainSidebarMenu(): ISidebarMenuItem[] {
  return removeSidebarOverlayChildren(SidebarMenu);
}

/**
 * Predicates whether the sidebar item has feature ability.
 */
function useFilterSidebarItemFeaturePredicater() {
  const { featureCan } = useFeatureCan();

  return {
    // Returns false if the item has `feature` prop and that feature has no ability.
    predicate: (item: ISidebarMenuItem) => {
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
    predicate: (item: ISidebarMenuItem) => {
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

  // NOTE: the legacy code passes an array as the searched value (a latent bug
  // that can never match); the wrapper keeps the exact runtime behavior while
  // satisfying lodash's typings.
  const includesValue = includes as unknown as (
    collection: ISidebarSubscriptionAbility[],
    value: unknown,
  ) => boolean;

  return {
    predicate: (item: ISidebarMenuItem) => {
      const { subscription } = item;

      if (subscription) {
        const isActive = includesValue(subscription, [
          ISidebarSubscriptionAbility.Active,
        ])
          ? isSubscriptionActive
          : true;

        // `Inactive` is missing from `ISidebarSubscriptionAbility` (latent bug);
        // the cast preserves the same runtime value (`undefined`).
        const inactiveAbility = (
          ISidebarSubscriptionAbility as Partial<
            Record<'Inactive', ISidebarSubscriptionAbility>
          >
        ).Inactive;

        const isInactive = includesValue(subscription, [inactiveAbility])
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
function useFilterSidebarMenuAbility(
  menu: Array<SidebarMenuItem | ISidebarMenuItem>,
): ISidebarMenuItem[] {
  const { predicate: predFeature } = useFilterSidebarItemFeaturePredicater();
  const { predicate: predAbility } = useFilterSidebarItemAbilityPredicater();
  const { predicate: predSubscription } =
    useFilterSidebarItemSubscriptionPredicater();

  return deepdash.filterDeep(
    menu,
    (item: ISidebarMenuItem) => predFeature(item) && predAbility(item),
    deepDashConfig,
  );
}

/**
 * Flats the sidebar menu groups.
 * @param   {*} menu
 * @returns {}
 */
function useFlatSidebarMenu(menu: ISidebarMenuItem[]): ISidebarMenuItem[] {
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
  const onClick = (item: ISidebarMenuItemLink) => (event: React.MouseEvent) => {
    closeSidebarSubmenu();
    history.push(item.href);
  };
  return {
    bindOnClick: (item: ISidebarMenuItemLink) => {
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
  const onClick =
    (item: ISidebarMenuItemDialog) => (event: React.MouseEvent) => {
      closeSidebarSubmenu();
      openDialog(item.dialogName, item.dialogPayload);
    };
  return {
    bindOnClick: (item: ISidebarMenuItemDialog) => {
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
  const onClick =
    (item: ISidebarMenuItemOverlay) => (event: React.MouseEvent) => {
      closeSidebarSubmenu();
      toggleSidebarSubmenu({ submenuId: item.overlayId });
    };
  return {
    bindOnClick: (item: ISidebarMenuItemOverlay) => {
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
function useBindSidebarItemClick(menu: ISidebarMenuItem[]): ISidebarMenuItem[] {
  const { bindOnClick: bindLinkClickEvt } = useBindSidebarItemLinkClick();
  const { bindOnClick: bindOverlayClickEvt } = useBindSidebarItemOverlayClick();
  const { bindOnClick: bindItemDialogEvt } = useBindSidebarItemDialogClick();

  return React.useMemo(() => {
    return deepdash.mapValuesDeep(
      menu,
      (item: ISidebarMenuItem) => {
        switch (item.type) {
          case ISidebarMenuItemType.Link:
            return bindLinkClickEvt(item);
          case ISidebarMenuItemType.Overlay:
            return bindOverlayClickEvt(item);
          case ISidebarMenuItemType.Dialog:
            return bindItemDialogEvt(item);
          default:
            return item;
        }
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
const findSubmenuBySubmenuId =
  (submenuId: unknown) =>
  (menu: SidebarMenuItem[]): ISidebarMenuItem[] => {
    const groupItem = deepdash.findDeep(
      menu,
      (item: SidebarMenuItem) => {
        return (
          item.type === ISidebarMenuItemType.Overlay &&
          item.overlayId === submenuId
        );
      },
      deepDashConfig,
    );
    return groupItem?.value?.children || [];
  };

/**
 * Retrieves the main sidebar post-menu.
 * @returns {ISidebarMenuItem[]}
 */
export function useMainSidebarMenu(): ISidebarMenuItem[] {
  return FF.pipe(
    SidebarMenu,
    useFilterSidebarMenuAbility,
    filterSidebarItemHasNoChildren,
    useAssocSidebarItemHasChildren,
    removeSidebarOverlayChildren,
    useFlatSidebarMenu,
    useBindSidebarItemClick,
  );
}

/**
 * Assoc `hasChildren` prop to sidebar menu items.
 * @param   {ISidebarMenuItem[]} items
 * @returns {ISidebarMenuItem[]}
 */
function useAssocSidebarItemHasChildren(
  items: ISidebarMenuItem[],
): ISidebarMenuItem[] {
  return deepdash.mapValuesDeep(
    items,
    (item: ISidebarMenuItem) => {
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
export function useSubSidebarMenu(submenuId: unknown): ISidebarMenuItem[] {
  if (!submenuId) return [];

  return FF.pipe(
    SidebarMenu,
    findSubmenuBySubmenuId(submenuId),
    useFilterSidebarMenuAbility,
    filterSidebarItemHasNoChildren,
    useFlatSidebarMenu,
    useBindSidebarItemClick,
  );
}

/**
 * Observes the sidebar expending with body class.
 * @param {boolean} sidebarExpended
 */
export function useObserveSidebarExpendedBodyclass(sidebarExpended: boolean) {
  React.useEffect(() => {
    document.body.classList.toggle('has-mini-sidebar', !sidebarExpended);
  }, [sidebarExpended]);
}

/**
 * Detamrines whether the given sidebar menu item is active.
 * @returns {boolean}
 */
export function useIsSidebarMenuItemActive(item: ISidebarMenuItem): boolean {
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
export function filterSidebarItemHasNoChildren(
  items: ISidebarMenuItem[],
): ISidebarMenuItem[] {
  return filterValuesDeep((item: ISidebarMenuItem) => {
    // If it was group item and has no children items so discard that item.
    if (ingoreTypesEmpty.indexOf(item.type) !== -1 && isEmpty(item.children)) {
      return false;
    }
    return true;
  }, items);
}
