import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default", ...props }) => {
  if (variant === "inline") {
    return (
      <div className={cn("flex items-center justify-center py-8", className)} {...props}>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-sm text-gray-500">Loading tasks...</span>
        </div>
      </div>
    );
  }

  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-4", className)} {...props}>
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-xl p-6 shadow-subtle animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-3 bg-gray-100 rounded w-1/3"></div>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)} {...props}>
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
      </div>
      <p className="mt-4 text-gray-500 font-medium">Loading your tasks...</p>
      <p className="text-sm text-gray-400 mt-1">This won't take long</p>
    </div>
  );
};

export default Loading;