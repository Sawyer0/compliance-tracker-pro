import * as React from "react";
import { cn } from "@/lib/utils";
import { createStyles } from "@/lib/theme";

const formStyles = createStyles({
  fieldGap: "space-y-2",
  formGap: "space-y-4",
  label: "text-sm font-medium text-gray-700",
  error: "text-xs text-rose-500",
  helper: "text-xs text-gray-500",
  input:
    "h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50",
});

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  error,
  helperText,
  required = false,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn(formStyles.fieldGap, className)}>
      <label htmlFor={htmlFor} className={formStyles.label}>
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      {children}

      {error && <p className={formStyles.error}>{error}</p>}

      {helperText && !error && (
        <p className={formStyles.helper}>{helperText}</p>
      )}
    </div>
  );
}

export function Input({
  className,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
}) {
  return (
    <input
      className={cn(
        formStyles.input,
        error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/50",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  error,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
}) {
  return (
    <textarea
      className={cn(
        formStyles.input,
        "min-h-[80px] resize-vertical",
        error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/50",
        className
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  error,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  error?: boolean;
}) {
  return (
    <select
      className={cn(
        formStyles.input,
        "appearance-none bg-white pr-8",
        error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function FormGroup({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(formStyles.formGap, className)} {...props}>
      {children}
    </div>
  );
}
