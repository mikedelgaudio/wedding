interface RadioOption {
  label: string;
  value: boolean;
}

interface RadioGroupProps {
  name: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
  options?: RadioOption[];
  disabled?: boolean;
  required?: boolean;
}

export function RadioGroup({
  name,
  value,
  onChange,
  options = [
    { label: 'Will Attend', value: true },
    { label: 'Will Not Attend', value: false },
  ],
  disabled = false,
  required = false,
}: RadioGroupProps) {
  return (
    <div className="flex items-center gap-6 justify-end">
      {options.map(({ label, value: v }) => (
        <label
          key={label}
          className="flex whitespace-nowrap items-center cursor-pointer m-0 focus-within:ring-2 ring-stone-500 focus-within:outline-offset-6"
        >
          <input
            type="radio"
            name={name}
            value={String(v)}
            checked={value === v}
            onChange={() => onChange(v)}
            required={required}
            disabled={disabled}
            className="sr-only peer "
          />
          <span
            className="
              w-5 h-5 flex-shrink-0 border-2 rounded-full 
              border-black peer-checked:border-stone-600 
              peer-checked:bg-stone-600 peer-disabled:border-gray-200 
              peer-disabled:bg-gray-100 transition
            "
          />
          <span className="ml-2 select-none">{label}</span>
        </label>
      ))}
    </div>
  );
}
