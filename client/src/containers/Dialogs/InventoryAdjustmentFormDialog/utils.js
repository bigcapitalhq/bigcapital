import { add, sumBy, subtract } from 'lodash';

export const calculate = ({ type, quantity_on_hand }, operator) => {
  const qty = parseInt(quantity_on_hand);
  const quantity = parseInt(operator);

  if (type == 'decrement') {
    return subtract(qty, quantity);
  } else {
    return add(qty, quantity);
  }
};

// function calculate(qty, operator) {
//   return operator > 0
//     ? calculate(qty + 1, operator - 1)
//     : operator < 0
//     ? calculate(qty - 1, operator + 1)
//     : qty;
// }
