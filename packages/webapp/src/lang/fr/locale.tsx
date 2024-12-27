// @ts-nocheck
import printValue from '../printValue';

export const locale = {
  mixed: {
    default: '${path} est invalide',
    required: '${path} est un champ requis',
    oneOf: '${path} doit être l\'une des valeurs suivantes: ${values}',
    notOneOf: '${path} ne doit pas être l\'une des valeurs suivantes: ${values}',
    notType: ({ path, type, value, originalValue }) => {
      let isCast = originalValue != null && originalValue !== value;
      let msg =
        `${path} doit être de type \`${type}\`, ` +
        `mais la valeur finale était: \`${printValue(value, true)}\`` +
        (isCast
          ? ` (converti à partir de la valeur \`${printValue(originalValue, true)}\`).`
          : '.');

      if (value === null) {
        msg += `\n Si "null" est prévu comme une valeur vide, assurez-vous de marquer le schéma comme \`.nullable()\``;
      }

      return msg;
    },
    defined: '${path} doit être défini',
  },
  string: {
    length: '${path} doit être exactement de ${length} caractères',
    min: '${path} doit être au moins de ${min} caractères',
    max: '${path} doit être au plus de ${max} caractères',
    matches: '${path} doit correspondre à ce qui suit: "${regex}"',
    email: '${path} doit être un email valide',
    url: '${path} doit être une URL valide',
    trim: '${path} doit être une chaîne sans espaces superflus',
    lowercase: '${path} doit être une chaîne en minuscules',
    uppercase: '${path} doit être une chaîne en majuscules',
  },
  number: {
    min: '${path} doit être supérieur ou égal à ${min}',
    max: '${path} doit être inférieur ou égal à ${max}',
    lessThan: '${path} doit être inférieur à ${less}',
    moreThan: '${path} doit être supérieur à ${more}',
    notEqual: '${path} ne doit pas être égal à ${notEqual}',
    positive: '${path} doit être un nombre positif',
    negative: '${path} doit être un nombre négatif',
    integer: '${path} doit être un entier',
  },
  date: {
    min: '${path} doit être postérieur à ${min}',
    max: '${path} doit être antérieur à ${max}',
  },
  boolean: {},
  object: {
    noUnknown:
      '${path} ne peut pas avoir de clés non spécifiées dans la forme de l\'objet',
  },
  array: {
    min: '${path} doit avoir au moins ${min} éléments',
    max: '${path} doit avoir au plus ${max} éléments',
  },
};
