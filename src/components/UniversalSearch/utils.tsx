// @ts-nocheck

export const filterItemsByResourceType = (items, type) => {
    return items.filter((item) => item._type === type);
}