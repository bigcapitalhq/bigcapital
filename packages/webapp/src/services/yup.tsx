// @ts-nocheck
import * as Yup from 'yup';

Yup.addMethod(Yup.string, 'digits', function () {
  return this.test(
    'is-digits',
    '${path} should be digits only.',
    value => /^(0|[1-9]\d*)$/.test(value),
  );
});

Yup.addMethod(Yup.number, 'decimalScale', function(scale) {
  return this.test(
    'numeric-length',
    '${path} should decimal length ',
    (value) => {
      const reg = new RegExp(/^(?:\d{1,13}|(?!.{15})\d+\.\d+)$/);
      return reg.test(value);
    },
  );
})

export default Yup;
