export function InjectModelDefaultViews(defaultViews: any[]) {
  return function (target: any) {
    // Define the defaultViews static property on the class
    Object.defineProperty(target, 'defaultViews', {
      get: function () {
        return defaultViews;
      },
      enumerable: true,
      configurable: true,
    });

    return target;
  };
}
