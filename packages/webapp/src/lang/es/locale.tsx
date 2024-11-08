// @ts-nocheck
import printValue from '../printValue';

export const locale = {
  mixed: {
    default: '${path} es inválido',
    required: '${path} es un campo requerido',
    oneOf: '${path} debe ser uno de los siguientes valores: ${values}',
    notOneOf: '${path} no debe ser uno de los siguientes valores: ${values}',
    notType: ({ path, type, value, originalValue }) => {
      let isCast = originalValue != null && originalValue !== value;
      let msg =
        `${path} debe ser de tipo \`${type}\`, ` +
        `pero el valor final fue: \`${printValue(value, true)}\`` +
        (isCast
          ? ` (convertido del valor \`${printValue(originalValue, true)}\`).`
          : '.');

      if (value === null) {
        msg += `\n Si "null" se pretende como un valor vacío, asegúrate de marcar el esquema como \`.nullable()\``;
      }

      return msg;
    },
    defined: '${path} debe estar definido',
  },
  string: {
    length: '${path} debe tener exactamente ${length} caracteres',
    min: '${path} debe tener al menos ${min} caracteres',
    max: '${path} debe tener como máximo ${max} caracteres',
    matches: '${path} debe coincidir con lo siguiente: "${regex}"',
    email: '${path} debe ser un correo electrónico válido',
    url: '${path} debe ser una URL válida',
    trim: '${path} debe ser una cadena recortada',
    lowercase: '${path} debe ser una cadena en minúsculas',
    uppercase: '${path} debe ser una cadena en mayúsculas',
  },
  number: {
    min: '${path} debe ser mayor o igual a ${min}',
    max: '${path} debe ser menor o igual a ${max}',
    lessThan: '${path} debe ser menor que ${less}',
    moreThan: '${path} debe ser mayor que ${more}',
    notEqual: '${path} no debe ser igual a ${notEqual}',
    positive: '${path} debe ser un número positivo',
    negative: '${path} debe ser un número negativo',
    integer: '${path} debe ser un número entero',
  },
  date: {
    min: '${path} debe ser posterior a ${min}',
    max: '${path} debe ser anterior a ${max}',
  },
  boolean: {},
  object: {
    noUnknown:
      '${path} no puede tener claves no especificadas en la forma del objeto',
  },
  array: {
    min: '${path} debe tener al menos ${min} elementos',
    max: '${path} debe tener como máximo ${max} elementos',
  },
};
