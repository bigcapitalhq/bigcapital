import * as React from 'react';

interface Props extends React.SVGProps<SVGSVGElement> {
  height: number;
  width: number;
}

export const CheckCircled = ({ width, height, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    {...props}
  >
    <g fill="#3FA40D" fillRule="evenodd" clipPath="url(#a)" clipRule="evenodd">
      <path d="M9.21 3.915a.562.562 0 0 1 0 .795L5.647 8.272a.563.563 0 0 1-.795 0L2.978 6.397a.562.562 0 0 1 .796-.795L5.25 7.08l3.165-3.165a.563.563 0 0 1 .795 0Z" />
      <path d="M6 10.875A4.875 4.875 0 0 0 10.875 6 4.87 4.87 0 0 0 6 1.125a4.875 4.875 0 1 0 0 9.75ZM6 12a6 6 0 0 0 6-6c0-3.314-2.678-6-6-6a6 6 0 0 0 0 12Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
);
