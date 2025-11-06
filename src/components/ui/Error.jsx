import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Error = ({ 
  error = "Something went wrong", 
  onRetry, 
  className,
  variant = "default",
  ...props 
}) => {
  if (variant === "inline") {
    return (
      <div className={cn("bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3", className)} {...props}>
        <ApperIcon name="AlertCircle" className="h-5 w-5 text-red-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">Error</p>
          <p className="text-sm text-red-700">{error}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)} {...props}>
      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-600 mb-6 max-w-sm">{error}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-medium"
        >
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Try Again
        </button>
      )}
      
      <p className="text-sm text-gray-500 mt-4">
        If the problem persists, please refresh the page
      </p>
    </div>
  );
};

export default Error;