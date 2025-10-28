import React from 'react';

interface ArrowBottomLeftProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const ArrowBottomLeft: React.FC<ArrowBottomLeftProps> = ({
  size = 16,
  ...props
}) => {
  return (
    <span className={'bp4-icon bp4-icon-arrow-bottom-left'}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14 3C14 2.45 13.55 2 13 2C12.72 2 12.47 2.11 12.29 2.29L4 10.59V6C4 5.45 3.55 5 3 5S2 5.45 2 6V13C2 13.55 2.45 14 3 14H10C10.55 14 11 13.55 11 13C11 12.45 10.55 12 10 12H5.41L13.7 3.71C13.89 3.53 14 3.28 14 3Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
};
