import { useState } from "react";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import TaskForm from "@/components/molecules/TaskForm";
import TaskCounter from "@/components/molecules/TaskCounter";
import TaskList from "@/components/organisms/TaskList";

const TaskManager = () => {
const [tasks, setTasks] = useState([]);
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [activePriorityFilter, setActivePriorityFilter] = useState("all");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskCreated = async (taskData) => {
    try {
      await taskService.create(taskData);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  };

  const handleTasksChange = (updatedTasks) => {
setTasks(updatedTasks);
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      // Status filter
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
      
      let statusMatch = true;
      switch (activeStatusFilter) {
        case "active":
          statusMatch = !task.completed;
          break;
        case "completed":
          statusMatch = task.completed;
          break;
        case "due-today":
          statusMatch = taskDueDate && taskDueDate.getTime() === today.getTime() && !task.completed;
          break;
        case "overdue":
          statusMatch = taskDueDate && taskDueDate < today && !task.completed;
          break;
        default: // "all"
          statusMatch = true;
      }

      // Priority filter
      let priorityMatch = true;
      if (activePriorityFilter !== "all") {
        priorityMatch = task.priority === activePriorityFilter;
      }

      return statusMatch && priorityMatch;
    });
  };

  const handleStatusFilterChange = (filter) => {
    setActiveStatusFilter(filter);
  };

  const handlePriorityFilterChange = (filter) => {
    setActivePriorityFilter(filter);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-3">
              <ApperIcon name="CheckSquare" className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TaskFlow
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Stay organized and productive with your personal task manager
          </p>
        </div>

        {/* Task Creation Form */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-2">
              <ApperIcon name="Plus" className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Add New Task</h2>
          </div>
          <TaskForm onTaskCreated={handleTaskCreated} />
        </div>

        {/* Task Counter */}
        <div className="mb-8">
<TaskCounter 
            tasks={tasks} 
            filteredTasks={getFilteredTasks()}
            activeStatusFilter={activeStatusFilter}
            activePriorityFilter={activePriorityFilter}
          />
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl p-6 shadow-subtle border border-gray-100 mb-6">
          <div className="space-y-6">
            {/* Status Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Status</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeStatusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusFilterChange("all")}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="List" size={16} />
                  All Tasks
                </Button>
                <Button
                  variant={activeStatusFilter === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusFilterChange("active")}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Clock" size={16} />
                  Active
                </Button>
                <Button
                  variant={activeStatusFilter === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusFilterChange("completed")}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="CheckCircle" size={16} />
                  Completed
                </Button>
                <Button
                  variant={activeStatusFilter === "due-today" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusFilterChange("due-today")}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Calendar" size={16} />
                  Due Today
                </Button>
                <Button
                  variant={activeStatusFilter === "overdue" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusFilterChange("overdue")}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="AlertTriangle" size={16} />
                  Overdue
                </Button>
              </div>
            </div>

            {/* Priority Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Priority</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activePriorityFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePriorityFilterChange("all")}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Filter" size={16} />
                  All Priorities
                </Button>
                <Button
                  variant={activePriorityFilter === "high" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePriorityFilterChange("high")}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="AlertCircle" size={16} />
                  High Priority
                </Button>
                <Button
                  variant={activePriorityFilter === "medium" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePriorityFilterChange("medium")}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Minus" size={16} />
                  Medium Priority
                </Button>
                <Button
                  variant={activePriorityFilter === "low" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePriorityFilterChange("low")}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="ChevronDown" size={16} />
                  Low Priority
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-2">
                <ApperIcon name="List" className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Your Tasks</h2>
            </div>
            {tasks.length > 0 && (
              <div className="text-sm text-gray-500">
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total
              </div>
            )}
          </div>
          
<TaskList
            refreshTrigger={refreshTrigger}
            onTasksChange={handleTasksChange}
            filteredTasks={getFilteredTasks()}
            activeStatusFilter={activeStatusFilter}
            activePriorityFilter={activePriorityFilter}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8">
          <p className="text-gray-400 text-sm">
            Built with React, designed for productivity
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;