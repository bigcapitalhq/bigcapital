// @ts-nocheck
import printValue from '../printValue';

export const locale = {
  mixed: {
    default: '${path} är inkorrekt',
    required: '${path} är ett obligatoriskt fält ',
    oneOf: '${path} måste vara en av följande värden: ${values}',
    notOneOf: '${path} kan inte vara en av följande värden: ${values}',
    notType: ({ path, type, value, originalValue }) => {
      let isCast = originalValue != null && originalValue !== value;
      let msg =
        `${path} måste ha typen \`${type}\`, ` +
        `men det slutliga värdet var: \`${printValue(value, true)}\`` +
        (isCast
          ? ` (gjord av värdet \`${printValue(originalValue, true)}\`).`
          : '.');

      if (value === null) {
        msg += `\n Om ”null” är avsett som ett tomt värde ska du se till att markera schemat som \`.nullable()\``;
      }

      return msg;
    },
    defined: '${path} måste vara definierad',
  },
  string: {
    length: '${path} måste vara exakt ${length} tecken',
    min: '${path} måste vara som minst ${min} tecken',
    max: '${path} måste vara som mest ${max} tecken',
    matches: '${path} måste matcha det följande: "${regex}"',
    email: '${path} måste vara en giltig e-post',
    url: '${path} måste vara en giltig URL',
    trim: '${path}  måste vara en trimmad sträng',
    lowercase: '${path} måste vara en sträng med små bokstäver',
    uppercase: '${path} måste vara en sträng med stora bokstäver',
  },
  number: {
    min: '${path} måste vara större eller lika med ${min}',
    max: '${path} måste vara mindre eller lika med ${max}',
    lessThan: '${path} måste vara mindre än ${less}',
    moreThan: '${path} måste vara större än ${more}',
    notEqual: '${path} får inte vara lika med ${notEqual}',
    positive: '${path} får inte vara ett positivt nummer',
    negative: '${path} får inte vara ett negativt nummer',
    integer: '${path} måste vara ett nummer',
  },
  date: {
    min: '${path} fältet måste vara senare än ${min}',
    max: '${path} fältet måste vara tidigare än ${max}',
  },
  boolean: {},
  object: {
    noUnknown:
      '${path}-fältet kan inte ha nycklar som inte anges i objektform',
  },
  array: {
    min: '${path}-fältet måste ha minst ${min} objekt',
    max: '${path} fältet måste ha mindre än eller lika med ${max} objekt',
  },
};
