
export const assocDepthLevelToObjectTree = (
  objects,
  level = 1,
  propertyName = 'level'
) => {
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    object[propertyName] = level;

    if (object.children) {
      assocDepthLevelToObjectTree(object.children, level + 1, propertyName);
    }
  }
  return objects;
};