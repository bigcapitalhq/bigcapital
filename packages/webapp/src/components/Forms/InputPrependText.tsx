import React from 'react';

interface InputPrependTextProps {
  text?: React.ReactNode;
  children?: React.ReactNode;
}

export function InputPrependText({ text }: InputPrependTextProps) {
  return (
    <div className="input-group-prepend">
      <span className="input-group-text">{text}</span>
    </div>
  );
}
