import React from 'react';

interface LayoutAutoIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const LayoutAutoIcon: React.FC<LayoutAutoIconProps> = ({
  size = 16,
  ...props
}) => (
  <span className={'bp4-icon bp4-icon-arrow-bottom-left'}>
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      enableBackground={`new 0 0 ${size} ${size}`}
      xmlSpace="preserve"
      {...props}
    >
      <g id="layout_auto_4_">
        <g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14,9.5c-0.56,0-1.06,0.23-1.42,0.59L8.99,8l3.59-2.09
          C12.94,6.27,13.44,6.5,14,6.5c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2s-2,0.9-2,2c0,0.19,0.03,0.37,0.08,0.54L8.5,7.13v-3.2
          C9.36,3.71,10,2.93,10,2c0-1.1-0.9-2-2-2S6,0.9,6,2c0,0.93,0.64,1.71,1.5,1.93v3.2L3.92,5.04C3.97,4.87,4,4.69,4,4.5
          c0-1.1-0.9-2-2-2s-2,0.9-2,2c0,1.1,0.9,2,2,2c0.56,0,1.06-0.23,1.42-0.59L7.01,8l-3.59,2.09C3.06,9.73,2.56,9.5,2,9.5
          c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2s2-0.9,2-2c0-0.19-0.03-0.37-0.08-0.54L7.5,8.87v3.2C6.64,12.29,6,13.07,6,14c0,1.1,0.9,2,2,2
          s2-0.9,2-2c0-0.93-0.64-1.71-1.5-1.93v-3.2l3.58,2.09C12.03,11.13,12,11.31,12,11.5c0,1.1,0.9,2,2,2s2-0.9,2-2
          C16,10.4,15.1,9.5,14,9.5z"
          />
        </g>
      </g>
    </svg>
  </span>
);
