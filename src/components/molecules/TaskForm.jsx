import { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import { cn } from "@/utils/cn";

const TaskForm = ({ onTaskCreated, className, ...props }) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    } else if (formData.title.trim().length < 2) {
      newErrors.title = "Task title must be at least 2 characters";
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Task title must be less than 100 characters";
    }
    
    if (formData.description.trim().length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onTaskCreated(formData);
      
      // Reset form
setFormData({
        title: "",
        description: "",
        dueDate: ""
      });
      
      toast.success("Task created successfully!");
    } catch (error) {
      toast.error("Failed to create task. Please try again.");
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn("space-y-4", className)} 
      {...props}
    >
      <div className="space-y-2">
        <label htmlFor="task-title" className="block text-sm font-semibold text-gray-700">
          Task Title
        </label>
        <Input
          id="task-title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Enter your task title..."
          error={errors.title}
          disabled={isSubmitting}
          className="text-base"
          autoFocus
        />
        {errors.title && (
          <p className="text-sm text-red-600 flex items-center mt-1">
            <ApperIcon name="AlertCircle" className="h-4 w-4 mr-1" />
            {errors.title}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="task-description" className="block text-sm font-semibold text-gray-700">
          Description
          <span className="text-gray-400 font-normal ml-1">(optional)</span>
        </label>
        <Textarea
          id="task-description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Add more details about your task..."
          error={errors.description}
          disabled={isSubmitting}
          rows={3}
          className="text-base"
        />
        {errors.description && (
          <p className="text-sm text-red-600 flex items-center mt-1">
            <ApperIcon name="AlertCircle" className="h-4 w-4 mr-1" />
            {errors.description}
          </p>
        )}
</div>

      <div className="space-y-2">
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Due Date (Optional)
        </label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
          className={cn(
            "transition-all duration-200",
            errors.dueDate && "border-red-300 focus:border-red-500 focus:ring-red-200"
          )}
        />
        {errors.dueDate && (
          <div className="flex items-center text-red-600 text-sm mt-1">
            <ApperIcon name="AlertCircle" className="h-4 w-4 mr-1" />
            {errors.dueDate}
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting || !formData.title.trim()}
        className="w-full sm:w-auto"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <ApperIcon name="Loader2" className="h-5 w-5 mr-2 animate-spin" />
            Adding Task...
          </>
        ) : (
          <>
            <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
            Add Task
          </>
        )}
      </Button>
    </form>
  );
};

export default TaskForm;