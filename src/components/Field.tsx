import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

const labelClass = "block text-xs font-semibold text-ink mb-1.5";

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-rose mt-1">{message}</p>;
}

function Field({
  label,
  htmlFor,
  error,
  children,
  className = "",
}: FieldProps) {
  return (
    <div className={className}>
      {htmlFor ? (
        <label
          htmlFor={htmlFor}
          className={labelClass}>
          {label}
        </label>
      ) : (
        <div className={labelClass}>
          {label}
        </div>
      )}
      {children}
      {error && <ErrorText message={error} />}
    </div>
  );
}

export default Field;