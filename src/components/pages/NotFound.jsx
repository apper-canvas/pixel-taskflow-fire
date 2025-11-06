import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="FileQuestion" className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. 
            The page might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={handleGoHome} size="lg" className="w-full">
            <ApperIcon name="Home" className="h-5 w-5 mr-2" />
            Back to TaskFlow
          </Button>
          
          <p className="text-sm text-gray-400">
            Return to your task management dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;