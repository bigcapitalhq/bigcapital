import React from 'react';

interface DollarIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const DollarIcon: React.FC<DollarIconProps> = ({
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
      <g id="dollar_2_">
        <g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.83,9.51c-0.1-0.3-0.25-0.58-0.45-0.84c-0.2-0.26-0.45-0.49-0.75-0.7
          c-0.3-0.2-0.65-0.36-1.05-0.48c-0.16-0.04-0.43-0.11-0.8-0.2C9.43,7.2,9.05,7.11,8.66,7.01C8.27,6.91,7.92,6.82,7.6,6.74
          C7.29,6.66,7.11,6.62,7.06,6.61C6.63,6.49,6.28,6.32,6.01,6.09c-0.27-0.23-0.4-0.55-0.4-0.95c0-0.29,0.07-0.53,0.21-0.72
          c0.14-0.19,0.32-0.34,0.54-0.46c0.22-0.11,0.46-0.19,0.72-0.24C7.34,3.67,7.6,3.64,7.85,3.64c0.74,0,1.35,0.15,1.83,0.46
          c0.48,0.3,0.75,0.83,0.81,1.56h2.14c0-0.6-0.13-1.13-0.38-1.58c-0.25-0.45-0.59-0.84-1.02-1.15c-0.43-0.31-0.93-0.54-1.49-0.7
          C9.5,2.17,9.25,2.13,8.99,2.09V1c0-0.55-0.45-1-1-1c-0.55,0-1,0.45-1,1v1.08C6.76,2.11,6.53,2.15,6.31,2.21
          C5.77,2.34,5.29,2.55,4.87,2.82C4.45,3.1,4.11,3.45,3.85,3.87C3.59,4.3,3.46,4.8,3.46,5.37c0,0.3,0.04,0.59,0.13,0.88
          c0.09,0.29,0.23,0.56,0.44,0.82c0.21,0.26,0.48,0.49,0.83,0.7c0.35,0.21,0.79,0.38,1.31,0.51C7.02,8.49,7.73,8.66,8.31,8.8
          c0.58,0.13,1.08,0.28,1.52,0.42c0.25,0.09,0.48,0.23,0.69,0.44c0.21,0.21,0.32,0.53,0.32,0.97c0,0.21-0.05,0.42-0.14,0.63
          c-0.09,0.21-0.24,0.39-0.45,0.55c-0.21,0.16-0.47,0.29-0.81,0.39c-0.33,0.1-0.73,0.15-1.2,0.15c-0.43,0-0.84-0.05-1.21-0.14
          c-0.37-0.09-0.7-0.24-0.99-0.43c-0.29-0.2-0.51-0.45-0.67-0.76c-0.16-0.31-0.24-0.68-0.24-1.12H3c0.01,0.71,0.15,1.32,0.43,1.84
          c0.27,0.52,0.64,0.94,1.1,1.27c0.46,0.33,0.99,0.58,1.61,0.74c0.27,0.07,0.56,0.12,0.85,0.16V15c0,0.55,0.45,1,1,1
          c0.55,0,1-0.45,1-1v-1.05c0.3-0.03,0.61-0.08,0.9-0.15c0.58-0.13,1.1-0.34,1.56-0.63c0.46-0.29,0.83-0.66,1.11-1.11
          c0.28-0.45,0.42-1,0.42-1.64C12.98,10.11,12.93,9.81,12.83,9.51z"
          />
        </g>
      </g>
    </svg>
  </span>
);