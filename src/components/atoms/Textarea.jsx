import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ 
  className, 
  error,
  rows = 3,
  ...props 
}, ref) => {
  return (
    <textarea
      className={cn(
        "flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-gray-400 resize-none",
        "focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-red-300 focus:border-red-500 focus:ring-red-500/10",
        className
      )}
      rows={rows}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;