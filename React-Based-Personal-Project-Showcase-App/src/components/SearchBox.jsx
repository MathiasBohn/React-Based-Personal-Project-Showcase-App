import { useEffect, useRef } from "react";

export default function SearchBox({ value, onChange, autoFocus = false, placeholder = "Search..." }) {
  const inputElementRef = useRef(null);

  useEffect(() => {
    if (autoFocus) inputElementRef.current?.focus();
  }, [autoFocus]);

  return (
    <input
      ref={inputElementRef}
      className="input"
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}