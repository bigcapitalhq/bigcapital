const globalStateClassesMapping: Record<string, string> = {
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

function generateUtilityClass(componentName: string, slot: string): string {
  const globalStateClass = globalStateClassesMapping[slot];
  return globalStateClass || `${componentName}__${slot}`;
}

function generateUtilityClasses(
  componentName: string,
  modifiers: string[],
): Record<string, string> {
  const result: Record<string, string> = {
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
