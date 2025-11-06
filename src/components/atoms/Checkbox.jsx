import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Checkbox = forwardRef(({ 
  className,
  checked,
  ...props 
}, ref) => {
  return (
    <input
      type="checkbox"
      className={cn("custom-checkbox", className)}
      checked={checked}
      ref={ref}
      {...props}
    />
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;