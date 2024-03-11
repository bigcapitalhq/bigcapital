import * as Yup from 'yup';

export function trimObject(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    // Trim the key
    const trimmedKey = key.trim();

    // Trim the value if it's a string, otherwise leave it as is
    const trimmedValue = typeof value === 'string' ? value.trim() : value;

    // Assign the trimmed key and value to the accumulator object
    return { ...acc, [trimmedKey]: trimmedValue };
  }, {});
}

export const convertFieldsToYupValidation = (fields: any) => {
  const yupSchema = {};
  Object.keys(fields).forEach((fieldName) => {
    const field = fields[fieldName];
    let fieldSchema;
    fieldSchema = Yup.string().label(field.name);

    if (field.fieldType === 'text') {
      if (field.minLength) {
        fieldSchema = fieldSchema.min(
          field.minLength,
          `Minimum length is ${field.minLength} characters`
        );
      }
      if (field.maxLength) {
        fieldSchema = fieldSchema.max(
          field.maxLength,
          `Maximum length is ${field.maxLength} characters`
        );
      }
    } else if (field.fieldType === 'number') {
      fieldSchema = Yup.number().label(field.name);
    } else if (field.fieldType === 'boolean') {
      fieldSchema = Yup.boolean().label(field.name);
    } else if (field.fieldType === 'enumeration') {
      const options = field.options.reduce((acc, option) => {
        acc[option.key] = option.label;
        return acc;
      }, {});
      fieldSchema = Yup.string().oneOf(Object.keys(options)).label(field.name);
    }
    if (field.required) {
      fieldSchema = fieldSchema.required();
    }
    yupSchema[fieldName] = fieldSchema;
  });
  return Yup.object().shape(yupSchema);
};

export const ERRORS = {
  RESOURCE_NOT_IMPORTABLE: 'RESOURCE_NOT_IMPORTABLE',
  INVALID_MAP_ATTRS: 'INVALID_MAP_ATTRS',
  DUPLICATED_FROM_MAP_ATTR: 'DUPLICATED_FROM_MAP_ATTR',
  DUPLICATED_TO_MAP_ATTR: 'DUPLICATED_TO_MAP_ATTR',
  IMPORT_FILE_NOT_MAPPED: 'IMPORT_FILE_NOT_MAPPED',
};
