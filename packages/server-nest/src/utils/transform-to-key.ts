
export const transformToMap = (objects, key) => {
  const map = new Map();

  objects.forEach((object) => {
    map.set(object[key], object);
  });
  return map;
};
