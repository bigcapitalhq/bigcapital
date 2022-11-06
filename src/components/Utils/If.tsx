// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';

export const If = (props) =>
  props.condition ? (props.render ? props.render() : props.children) : null;

If.propTypes = {
  // condition: PropTypes.bool.isRequired,
  children: PropTypes.node,
  render: PropTypes.func,
};
