import { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";
import { cn } from "@/utils/cn";

const TaskItem = ({ task, onToggleComplete, onDelete, className, ...props }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    try {
      await onToggleComplete(task.id);
      toast.success(task.completed ? "Task marked as active" : "Task completed! 🎉");
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Error toggling task:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(task.id);
      toast.success("Task deleted");
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", error);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <>
      <div 
        className={cn(
          "bg-white rounded-xl p-6 shadow-subtle border border-gray-100 task-card transition-all duration-200",
          task.completed && "opacity-60",
          className
        )} 
        {...props}
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 pt-1">
            <Checkbox
              checked={task.completed}
              onChange={handleToggleComplete}
              disabled={isUpdating}
              className={cn(
                "transition-all duration-200",
                isUpdating && "opacity-50 cursor-not-allowed"
              )}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 
              className={cn(
                "font-semibold text-gray-900 text-lg leading-tight",
                task.completed && "task-title-completed text-gray-500"
              )}
            >
              {task.title}
            </h3>
            
            {task.description && (
              <p className={cn(
                "text-gray-600 mt-2 text-sm leading-relaxed",
                task.completed && "text-gray-400"
              )}>
                {task.description}
              </p>
            )}
            
            <div className="flex items-center mt-3 text-xs text-gray-400">
              <ApperIcon name="Clock" className="h-3 w-3 mr-1" />
              <span>Created {formatDate(task.createdAt)}</span>
              {task.updatedAt !== task.createdAt && (
                <>
                  <span className="mx-2">•</span>
                  <span>Updated {formatDate(task.updatedAt)}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2"
            >
              <ApperIcon name="Trash2" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 rounded-full p-2">
                <ApperIcon name="AlertTriangle" className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Task</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "<span className="font-medium">{task.title}</span>"? 
              This action cannot be undone.
            </p>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                className="flex-1"
              >
                <ApperIcon name="Trash2" className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskItem;