import React from 'react';
import { Row, Col } from 'react-grid-system';

function Copyright() {
  return (
    <Row className={'copyright-page'}>
      <Col md={12}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='180'
          height='18'
          viewBox='0 0 195 18'
        >
          <text
            data-name='© 2001–2020 All Rights Reserved. '
            transform='translate(0 13)'
            fill='#666'
            font-size='13'
            font-family='SegoeUI, Segoe UI'
          >
            <tspan x='0' y='2'>
              © 2001–2020 All Rights Reserved.
            </tspan>
          </text>
        </svg>
      </Col>
      <Col md={12}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='121'
          height='20'
          viewBox='0 0 121.499 26'
        >
          <g
            id='Component_2_5'
            data-name='Component 2 – 5'
            transform='translate(29.499 3)'
          >
            <text
              id='Bigcapital.'
              transform='translate(0 18)'
              fill='#a3a3a3'
              font-size='18'
              font-family='SegoeUI-Bold, Segoe UI'
              font-weight='700'
              // letter-spacing='-0.005em'
              line-height='14'
            >
              <tspan x='0' y='0'>
                Bigcapital
              </tspan>
              <tspan y='0' font-size='14'>
                .
              </tspan>
            </text>
          </g>
          <rect
            id='Rectangle_107'
            data-name='Rectangle 107'
            width='2.919'
            height='16.053'
            transform='translate(21.566 10.444) rotate(45)'
            fill='#a3a3a3'
          />
          <rect
            id='Rectangle_108'
            data-name='Rectangle 108'
            width='2.919'
            height='16.053'
            transform='translate(11.351 11.903) rotate(45)'
            fill='#a3a3a3'
          />
        </svg>
      </Col>
    </Row>
  );
}

export default Copyright;
