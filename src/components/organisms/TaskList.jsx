import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import TaskItem from "@/components/molecules/TaskItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { cn } from "@/utils/cn";

const TaskList = ({ refreshTrigger, onTasksChange, className, ...props }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const fetchedTasks = await taskService.getAll();
      // Sort tasks: incomplete first, then completed, with newest first within each group
      const sortedTasks = fetchedTasks.sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setTasks(sortedTasks);
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
        // Re-sort after toggle
        const sortedTasks = newTasks.sort((a, b) => {
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        onTasksChange?.(sortedTasks);
        return sortedTasks;
      });
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

  return (
    <div className={cn("space-y-4 task-list", className)} {...props}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList;