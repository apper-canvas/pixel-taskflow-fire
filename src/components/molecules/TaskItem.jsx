import { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import { cn } from "@/utils/cn";

const TaskItem = ({ task, onToggleComplete, onDelete, onUpdate, className, ...props }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [editDueDate, setEditDueDate] = useState(task.dueDate || "");

  const getCategoryColor = (category) => {
    const colors = {
      'Work': 'bg-blue-100 text-blue-700 border-blue-200',
      'Personal': 'bg-green-100 text-green-700 border-green-200', 
      'Shopping': 'bg-purple-100 text-purple-700 border-purple-200',
      'Health': 'bg-red-100 text-red-700 border-red-200',
      'Finance': 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };
    return colors[category] || colors['Personal'];
  };

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

const handleUpdateTask = async (field, value) => {
    try {
      const updateData = { [field]: value };
      await onUpdate(task.id, updateData);
      if (field === 'dueDate') {
        setEditDueDate(value);
      }
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Error updating task:", error);
    }
  };

  const handleCategoryChange = async () => {
    const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Finance'];
    const currentIndex = categories.indexOf(task.category || 'Personal');
    const nextIndex = (currentIndex + 1) % categories.length;
    handleUpdateTask('category', categories[nextIndex]);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
const handleSaveTitle = async () => {
    if (editTitle.trim() === "") {
      toast.error("Title cannot be empty");
      return;
    }
    if (editTitle !== task.title) {
      await handleUpdateTask("title", editTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleSaveDescription = async () => {
    if (editDescription !== task.description) {
      await handleUpdateTask("description", editDescription.trim());
    }
    setIsEditingDescription(false);
  };

  const handleCancelTitle = () => {
    setEditTitle(task.title);
    setIsEditingTitle(false);
  };

  const handleCancelDescription = () => {
    setEditDescription(task.description || "");
    setIsEditingDescription(false);
  };
const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatDueDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today && !task.completed;
  };

return (
    <>
      <div 
        className={cn(
          "bg-white rounded-xl p-6 shadow-subtle border border-gray-100 task-card transition-all duration-200",
          task.completed && "opacity-60",
          isOverdue(task.dueDate) && "border-red-200 bg-red-50",
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
          {/* Category Tag */}
          <div className="flex items-center space-x-2 mb-2">
            <span 
              className={cn(
                "px-2 py-1 text-xs font-medium rounded-full border cursor-pointer transition-all duration-200 hover:scale-105",
                getCategoryColor(task.category || 'Personal')
              )}
              onClick={handleCategoryChange}
              title="Click to change category"
            >
              {task.category || 'Personal'}
            </span>
          </div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                {isEditingTitle ? (
                  <div className="space-y-2">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="font-semibold text-lg"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveTitle();
                        } else if (e.key === 'Escape') {
                          handleCancelTitle();
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={handleSaveTitle}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <ApperIcon name="Check" className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelTitle}
                      >
                        <ApperIcon name="X" className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <h3 
                    className={cn(
                      "font-semibold text-gray-900 text-lg leading-tight cursor-pointer hover:text-blue-600 transition-colors",
                      task.completed && "task-title-completed text-gray-500"
                    )}
                    onClick={() => setIsEditingTitle(true)}
                    title="Click to edit"
                  >
                    {task.title}
                  </h3>
                )}
              </div>
<div className="flex items-center space-x-2 ml-4">
                <span 
                  className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full border cursor-pointer transition-colors",
                    getPriorityColor(task.priority || 'Medium')
                  )}
                  onClick={() => {
                    const priorities = ['Low', 'Medium', 'High'];
                    const currentIndex = priorities.indexOf(task.priority || 'Medium');
                    const nextIndex = (currentIndex + 1) % priorities.length;
                    handleUpdateTask('priority', priorities[nextIndex]);
                  }}
                  title="Click to change priority"
                >
                  {task.priority || 'Medium'}
                </span>
              </div>
</div>
            {isEditingDescription ? (
              <div className="space-y-2 mt-2">
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="text-sm resize-none"
                  rows={3}
                  placeholder="Add description..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleSaveDescription();
                    } else if (e.key === 'Escape') {
                      handleCancelDescription();
                    }
                  }}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={handleSaveDescription}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <ApperIcon name="Check" className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelDescription}
                  >
                    <ApperIcon name="X" className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  "text-gray-600 mt-2 text-sm leading-relaxed cursor-pointer hover:text-blue-600 transition-colors min-h-[1.25rem]",
                  task.completed && "text-gray-400",
                  !task.description && "text-gray-400 italic"
                )}
                onClick={() => setIsEditingDescription(true)}
                title="Click to edit"
              >
                {task.description || "Click to add description..."}
              </div>
)}
            
            {task.dueDate && (
              <div className={cn(
                "flex items-center mt-3 text-sm",
                isOverdue(task.dueDate) ? "text-red-600" : "text-gray-600"
              )}>
                <ApperIcon 
                  name={isOverdue(task.dueDate) ? "AlertTriangle" : "Calendar"} 
                  className="h-4 w-4 mr-2" 
                />
                <span>Due {formatDueDate(task.dueDate)}</span>
                {isOverdue(task.dueDate) && (
                  <span className="ml-2 text-xs font-medium px-2 py-1 bg-red-100 text-red-700 rounded-full">
                    Overdue
                  </span>
                )}
              </div>
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