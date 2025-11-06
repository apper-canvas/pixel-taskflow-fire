import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import TaskItem from "@/components/molecules/TaskItem";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

// Helper function to get sort display label
const getSortLabel = (sortBy) => {
  switch (sortBy) {
    case "dueDate": return "Due Date";
    case "priority": return "Priority";
    case "alphabetical": return "A-Z";
    case "createdAt": 
    default: return "Recent";
  }
};
import { cn } from "@/utils/cn";

const TaskList = ({ refreshTrigger, onTasksChange, filteredTasks, activeStatusFilter, activePriorityFilter, searchQuery, sortBy, className, ...props }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const fetchedTasks = await taskService.getAll();
      // Sort tasks: incomplete first, then completed, with newest first within each group
// No longer sort here - sorting is handled by parent component
      setTasks(fetchedTasks);
      onTasksChange?.(sortedTasks);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [refreshTrigger]);

  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId);
      setTasks(prevTasks => {
        const newTasks = prevTasks.map(task => 
          task.id === taskId ? updatedTask : task
);
// No longer sort here - sorting is handled by parent component
        const sortedTasks = newTasks;
        onTasksChange?.(sortedTasks);
        return sortedTasks;
      });
    } catch (err) {
      throw err;
    }
  };

const handleUpdateTask = async (taskId, updateData) => {
    try {
const updatedTask = await taskService.update(taskId, updateData);
      setTasks(prevTasks => {
        const newTasks = prevTasks.map(task => 
          task.id === taskId ? updatedTask : task
        );
        onTasksChange?.(newTasks);
        return newTasks;
      });
      return updatedTask;
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
setTasks(prevTasks => {
        const newTasks = prevTasks.filter(task => task.id !== taskId);
        onTasksChange?.(newTasks);
        return newTasks;
      });
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return <Loading variant="skeleton" className={className} {...props} />;
  }

  if (error) {
    return (
      <Error 
        error={error} 
        onRetry={loadTasks}
        className={className}
        {...props}
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <Empty
        title="Your task list is empty"
        description="Add your first task to get started and stay organized!"
        icon="CheckSquare"
        className={className}
        {...props}
      />
    );
  }
// Use filtered tasks when available, otherwise use all tasks
  const displayTasks = filteredTasks || tasks;

if (displayTasks.length === 0) {
    const isFiltered = activeStatusFilter !== "all" || activePriorityFilter !== "all" || (searchQuery && searchQuery.trim());
    const hasSearchQuery = searchQuery && searchQuery.trim();
    
    return (
      <div className="bg-white rounded-2xl p-8 shadow-subtle border border-gray-100">
        <div className="text-center">
          <ApperIcon name={isFiltered ? "Search" : "CheckCircle"} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasSearchQuery 
              ? `No tasks match "${searchQuery}"`
              : isFiltered 
                ? "No tasks match your filters" 
                : "No tasks yet"
            }
          </h3>
          <p className="text-gray-500">
            {hasSearchQuery
              ? "Try searching with different keywords or check your spelling."
              : isFiltered 
                ? "Try adjusting your filter criteria to see more tasks." 
                : "Create your first task to get started with your productivity journey!"
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-2xl p-6 shadow-subtle border border-gray-100", className)} {...props}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Tasks
{(activeStatusFilter !== "all" || activePriorityFilter !== "all" || (searchQuery && searchQuery.trim())) && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({displayTasks.length} {searchQuery && searchQuery.trim() ? 'matching' : 'filtered'})
            </span>
          )}
        </h2>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto task-list">
        {displayTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={handleToggleComplete}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;