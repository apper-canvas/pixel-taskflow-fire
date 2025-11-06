import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  title = "No items found",
  description = "There are no items to display",
  actionLabel,
  onAction,
  icon = "Package",
  className,
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center empty-state", className)} {...props}>
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/20 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="h-10 w-10 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 mb-8 max-w-sm text-base leading-relaxed">{description}</p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:from-secondary hover:to-accent transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;