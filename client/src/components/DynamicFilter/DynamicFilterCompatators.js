export const BooleanCompatators = [
  { value: 'is', label_id: 'is' },
];

export const TextCompatators = [
  { value: 'contain', label_id: 'contain' },
  { value: 'not_contain', label_id: 'not_contain' },
  { value: 'equals', label_id: 'equals' },
  { value: 'not_equal', label_id: 'not_equals' },
];

export const DateCompatators = [
  { value: 'in', label_id: 'in' },
  { value: 'after', label_id: 'after' },
  { value: 'before', label_id: 'before' },
];

export const OptionsCompatators = [
  { value: 'is', label_id: 'is' },
  { value: 'is_not', label_id: 'is_not' },
];

export const getConditionTypeCompatators = (dataType) => {
  return [
    ...(dataType === 'options'
      ? [...OptionsCompatators]
      : dataType === 'date'
      ? [...DateCompatators]
      : dataType === 'boolean'
      ? [...BooleanCompatators]
      : [...TextCompatators]),
  ];
};

export const getConditionDefaultCompatator = (dataType) => {
  const compatators = getConditionTypeCompatators(dataType);
  return compatators[0];
};
