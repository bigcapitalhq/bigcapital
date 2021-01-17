export const decrementCalc = ({ quantity_on_hand, type }, e) => {
  if (type == 'decrement') {
    return parseInt(quantity_on_hand, 10) - parseInt(e.currentTarget.value, 10);
  } else {
    return e.currentTarget.value - quantity_on_hand;
  }
};

export const incrementCalc = ({ quantity_on_hand, quantity }, e) => {
  return parseInt(quantity_on_hand, 10) + parseInt(quantity, 10);
};
