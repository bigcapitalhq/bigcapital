/**
 * Map to store all models that have been marked to prevent base currency mutation.
 * Key is the model name, value is the model class.
 */
export const preventMutateBaseCurrencyModels = new Map<string, any>();

/**
 * Decorator that marks an ORM model to prevent base currency mutation.
 * When applied to a model class, it adds a static property `preventMutateBaseCurrency` set to true
 * and registers the model in the preventMutateBaseCurrencyModels map.
 *
 * @returns {ClassDecorator} A decorator function that can be applied to a class.
 */
export function PreventMutateBaseCurrency(): ClassDecorator {
  return (target: any) => {
    // Set the static property on the model class
    target.preventMutateBaseCurrency = true;

    // Register the model in the map
    const modelName = target.name;
    preventMutateBaseCurrencyModels.set(modelName, target);

    // Return the modified class
    return target;
  };
}

/**
 * Get all registered models that prevent base currency mutation.
 *
 * @returns {Map<string, any>} Map of model names to model classes
 */
export function getPreventMutateBaseCurrencyModels(): Map<string, any> {
  return preventMutateBaseCurrencyModels;
}

/**
 * Check if a model is registered to prevent base currency mutation.
 *
 * @param {string} modelName - The name of the model to check
 * @returns {boolean} True if the model is registered, false otherwise
 */
export function isModelPreventMutateBaseCurrency(modelName: string): boolean {
  return preventMutateBaseCurrencyModels.has(modelName);
}

/**
 * Get a specific model by name that prevents base currency mutation.
 *
 * @param {string} modelName - The name of the model to retrieve
 * @returns {any | undefined} The model class if found, undefined otherwise
 */
export function getPreventMutateBaseCurrencyModel(
  modelName: string,
): any | undefined {
  return preventMutateBaseCurrencyModels.get(modelName);
}
