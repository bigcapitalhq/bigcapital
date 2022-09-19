// @ts-nocheck
// Based on https://github.com/jquense/yup/blob/2973d0a/src/locale.js

import printValue from '../printValue';

export const locale = {
  mixed: {
    default: '${path} غير صالح.',
    required: '${path} هو حقل مطلوب',
    oneOf: '${path} يجب أن تكون واحدة من القيم التالية: ${values}',
    notOneOf: '${path} لا يجب أن تكون واحدة من القيم التالية: ${values}',
    notType: ({ path, type, value, originalValue }) => {
      const isCast = originalValue != null && originalValue !== value;
      let msg =
        `${path} يجب أن يكون \`${type}\` نوع, ` +
        `ولكن القيمة النهائية كانت في: \`${printValue(value, true)}\`` +
        (isCast
          ? ` (المدلى بها من قيمة \`${printValue(originalValue, true)}\`).`
          : '.');

      if (value === null) {
        msg +=
          `\n إذا كان المقصود "لاغية" كقيمة فارغة مما لا شك فيه للاحتفال مخطط كما` +
          ' `.nullable()`';
      }

      return msg;
    },
  },

  string: {
    length: '${path} يجب أن يكون بالضبط ${length} حرفا',
    min: '${path} يجب أن تكون على الأقل ${min} حرفا',
    max: '${path} يجب أن تكون على الأكثر ${max} حرفا',
    matches: '${path} يجب أن يطابق ما يلي: "${regex}"',
    email: '${path} يجب أن يكون عنوان بريد إلكتروني صالح',
    url: '${path} يجب أن يكون عنوان URL صالحا',
    trim: '${path} يجب أن تكون سلسلة قلص',
    lowercase: '${path} يجب أن تكون سلسلة صغيرة',
    uppercase: '${path} يجب أن تكون سلسلة الحالة العلوي',
  },

  number: {
    min: '${path} يجب أن تكون أكبر من أو يساوي ${min}',
    max: '${path} يجب أن يكون أقل من أو يساوي ${max}',
    lessThan: '${path} يجب أن يكون أقل من ${less}',
    moreThan: '${path} يجب أن تكون أكبر من ${more}',
    positive: '${path} يجب أن يكون رقما موجبا',
    negative: '${path} يجب أن يكون رقما سالبا',
    integer: '${path} يجب أن يكون رقما',
  },
  date: {
    min: '${path} يجب أن يكون حقل في وقت لاحق من ${min}',
    max: '${path} يجب أن يكون حقل في وقت سابق من ${max}',
  },
  boolean: {},

  object: {
    noUnknown: '${path} حقل لا يمكن أن يكون مفاتيح غير محددة في شكل وجوه',
  },
  array: {
    min: 'يجب أن يكون ${path} حقل على الأقل ${min} من العناصر',
    max: '${path} يجب أن يكون الحقل أقل من أو يساوي إلى ${max} من العناصر',
  },
};
