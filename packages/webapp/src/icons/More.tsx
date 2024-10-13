import React from 'react';

interface MoreIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const MoreIcon: React.FC<MoreIconProps> = ({ size = 16, ...props }) => (
  <svg
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox={`0 0 ${size} ${size}`}
    enableBackground={`new 0 0 ${size} ${size}`}
    xmlSpace="preserve"
    {...props}
  >
    <g id="more_3_">
      <circle cx="2" cy="8.03" r="2" />
      <circle cx="14" cy="8.03" r="2" />
      <circle cx="8" cy="8.03" r="2" />
    </g>
  </svg>
);
