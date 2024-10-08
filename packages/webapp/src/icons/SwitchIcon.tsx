import React from 'react';

interface SwitchIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const SwitchIcon: React.FC<SwitchIconProps> = ({
  size = 16,
  ...props
}) => (
  <span className={'bp4-icon bp4-icon-arrow-bottom-left'}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <g stroke="none" strokeWidth="1" fill="currentColor" fillRule="evenodd">
        <path d="M9.29289322,2.29289322 L10.7071068,3.70710678 L5.70795751,8.70727122 C5.89517048,9.09873251 6,9.53712413 6,10 C6,11.6568542 4.65685425,13 3,13 C1.34314575,13 0,11.6568542 0,10 C0,8.34314575 1.34314575,7 3,7 C3.46287587,7 3.90126749,7.10482952 4.29272878,7.29204249 L9.29289322,2.29289322 Z M13,7 C14.6568542,7 16,8.34314575 16,10 C16,11.6568542 14.6568542,13 13,13 C11.3431458,13 10,11.6568542 10,10 C10,8.34314575 11.3431458,7 13,7 Z M3,9 C2.44771525,9 2,9.44771525 2,10 C2,10.5522847 2.44771525,11 3,11 C3.55228475,11 4,10.5522847 4,10 C4,9.44771525 3.55228475,9 3,9 Z M13,9 C12.4477153,9 12,9.44771525 12,10 C12,10.5522847 12.4477153,11 13,11 C13.5522847,11 14,10.5522847 14,10 C14,9.44771525 13.5522847,9 13,9 Z" />
      </g>
    </svg>
  </span>
);
