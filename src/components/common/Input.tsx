import React, {forwardRef} from "react";

type Props = {
  type: string;
  id: string;
  value?: string;
  required: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
};

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {type, id, value, required, onChange, className} = props;

  return (
    <input
      ref={ref}
      type={type}
      id={id}
      value={type === "file" ? undefined : value}
      required={required}
      onChange={onChange}
      className={className}
    />
  );
});

Input.displayName = "Input";
export default Input;
