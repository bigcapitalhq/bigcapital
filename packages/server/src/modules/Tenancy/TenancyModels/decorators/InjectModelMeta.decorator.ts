
/**
 * Decorator function that adds metadata to the model class.
 * @param value - The metadata value to be added to the model.
 * @returns A class decorator function.
 */
export function InjectModelMeta(value: any) {
  return function(target: any) {
    // Define a static getter for 'meta' on the target class
    Object.defineProperty(target, 'meta', {
      get: function() {
        return value;
      },
      enumerable: true,
      configurable: true
    });
  };
}