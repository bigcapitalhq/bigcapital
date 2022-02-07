import React from 'react';
import styled from 'styled-components';

export default function FlagKit({ flage }) {
  return (
    <React.Fragment>
      <Img
        alt="flag"
        src={`https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/${flage}.svg`}
      />
    </React.Fragment>
  );
}

const Img = styled.img`
  display: inline-block;
  object-fit: cover;
  object-position: center;
  margin: 0 5px;
`;
