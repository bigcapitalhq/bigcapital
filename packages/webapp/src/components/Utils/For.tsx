// @ts-nocheck
import PropTypes from 'prop-types';

export const For = ({ render, of }) =>
  of.map((item, index) => render(item, index));

For.propTypes = {
  of: PropTypes.array.isRequired,
  render: PropTypes.func.isRequired,
};
