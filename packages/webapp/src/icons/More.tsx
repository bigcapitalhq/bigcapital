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
      <circle cx={size / 8} cy={size / 2.00625} r={size / 8} />
      <circle cx={size - size / 8} cy={size / 2.00625} r={size / 8} />
      <circle cx={size / 2} cy={size / 2.00625} r={size / 8} />
    </g>
  </svg>
);
