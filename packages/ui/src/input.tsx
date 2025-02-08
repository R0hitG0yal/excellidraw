export function Input({
  id,
  name,
  autoComplete,
  isRequired = false,
  value,
  onChange,
  type,
  placeholder,
  className,
}: {
  id?: string;
  name?: string;
  type: string;
  autoComplete?: string;
  isRequired?: boolean;
  value: string;
  onChange: (e: any) => void;
  placeholder?: string;
  className: string;
}) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      autoComplete={autoComplete}
      required={isRequired}
      value={value}
      onChange={onChange}
      className={className}
      placeholder={placeholder}
    />
  );
}
// import { forwardRef } from "react";

// interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   isRequired?: boolean;
// }

// const Input = forwardRef<HTMLInputElement, InputProps>(
//   ({ className, isRequired, ...props }, ref) => {
//     return (
//       <input ref={ref} required={isRequired} className={className} {...props} />
//     );
//   }
// );

// Input.displayName = "Input";

// export { Input };
// export type { InputProps };
