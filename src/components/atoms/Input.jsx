import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-gray-400",
        "focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-red-300 focus:border-red-500 focus:ring-red-500/10",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;