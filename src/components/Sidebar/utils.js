import sidebarMenuList from 'config/sidebarMenu';
import { isArray, isEmpty } from 'lodash';
import { useAbilityContext } from 'hooks/utils';

export function useGetSidebarMenu() {
  const ability = useAbilityContext();

  return sidebarMenuList
    .map((item) => {
      const children = isArray(item.children)
        ? item.children.filter((childItem) => {
            return isArray(childItem.permission)
              ? childItem.permission.some((perm) =>
                  ability.can(perm.ability, perm.subject),
                )
              : childItem?.permission?.ability && childItem?.permission?.subject
              ? ability.can(
                  childItem.permission.ability,
                  childItem.permission.subject,
                )
              : true;
          })
        : [];

      return {
        ...item,
        ...(isArray(item.children)
          ? {
              children,
            }
          : {}),
      };
    })
    .filter((item) => {
      return isArray(item.permission)
        ? item.permission.some((per) =>
            ability.can(per.ability, per.subject),
          )
        : item?.permission?.ability && item?.permission?.subject
        ? ability.can(item.permission.ability, item.permission.subject)
        : true;
    })
    .filter((item) =>
      isEmpty(item.children) && !item.href && !item.label && !item.divider
        ? false
        : true,
    );
}
