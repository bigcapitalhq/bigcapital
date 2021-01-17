
export const decrementQuantity = (newQuantity, quantityOnHand) => {
  return quantityOnHand - newQuantity;
};

export const incrementQuantity = (newQuantity, quantityOnHand) => {
  return quantityOnHand + newQuantity;
};

export const diffQuantity = (newQuantity, quantityOnHand, type) => {
  return type === 'decrement'
    ? decrementQuantity(newQuantity, quantityOnHand)
    : incrementQuantity(newQuantity, quantityOnHand);
};
