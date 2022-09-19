// @ts-nocheck
const globalStateClassesMapping = {
  active: 'active',
  checked: 'checked',
  completed: 'completed',
  disabled: 'disabled',
  error: 'error',
  expanded: 'expanded',
  focused: 'focused',
  focusVisible: 'focusVisible',
  required: 'required',
  selected: 'selected',
};

function generateUtilityClass(componentName, slot) {
  const globalStateClass = globalStateClassesMapping[slot];
  return globalStateClass || `${componentName}__${slot}`;
}

function generateUtilityClasses(componentName, modifiers) {
  const result = {
    root: componentName,
  };
  modifiers.forEach((modifier) => {
    result[modifier] = generateUtilityClass(componentName, modifier);
  });

  return result;
}

export const EstimateDrawerCls = generateUtilityClasses('estimate-drawer', [
  'content',
]);
