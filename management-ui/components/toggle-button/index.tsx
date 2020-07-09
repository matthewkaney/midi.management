import React from 'react';

import './togglebutton.css';

type ToggleButtonProps = {
  onChange: (value: boolean) => any;
  value: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
};

export function ToggleButton({
  onChange,
  value,
  children,
  disabled = false,
}: ToggleButtonProps) {
  return (
    <label className="toggle">
      <input
        type="checkbox"
        checked={value}
        onChange={({ target: { checked } }) => {
          onChange(checked);
        }}
      />
      <span>{children}</span>
    </label>
  );
}
