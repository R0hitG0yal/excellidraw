export function Input({
  type,
  placeholder,
}: {
  type: string;
  placeholder: string;
}) {
  return <input type={type} placeholder={placeholder}></input>;
}
