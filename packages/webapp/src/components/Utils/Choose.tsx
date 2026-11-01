// @ts-nocheck
import PropTypes from 'prop-types';
import React from 'react';
import { If } from './If';

export const Choose = (props) => {
  let when = null;
  let otherwise = null;

  React.Children.forEach(props.children, (children) => {
    if (children.props.condition === undefined) {
      otherwise = children;
    } else if (!when && children.props.condition === true) {
      when = children;
    }
  });

  return when || otherwise;
};

Choose.propTypes = {
  children: PropTypes.node,
};

Choose.When = If;

Choose.Otherwise = ({
  render,
  children,
}: {
  render?: () => React.ReactNode;
  children?: React.ReactNode;
}): React.ReactElement | null => {
  const result = render ? render() : children;
  return result as React.ReactElement | null;
};

Choose.Otherwise.propTypes = {
  children: PropTypes.node,
  render: PropTypes.func,
};
