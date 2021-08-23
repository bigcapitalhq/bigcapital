import React from 'react';
import classNames from 'classnames';
import { Col, Row } from 'components';

import 'style/components/Details.scss';

/**
 * Details menu.
 */
export function DetailsMenu({ children, vertical = false }) {
  return (
    <div
      className={classNames('details-menu', {
        'is-vertical': vertical,
      })}
    >
      {children}
    </div>
  );
}

/**
 * Detail item vertical .
 */
export function DetailItemVER({ label, children }) {
  return (
    <div class="detail-item">
      <div class="detail-item__label">{label}</div>
      <div class="detail-item__content">{children}</div>
    </div>
  );
}

/**
 * Detail item horizontal .
 */
export function DetailItemHOR({ label, children }) {
  return (
    <Row>
      <Col className="label" xs={3}>
        {label}
      </Col>
      <Col xs={3}>{children}</Col>
    </Row>
  );
}
