import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import TaskList from "@/components/organisms/TaskList";
import TaskCounter from "@/components/molecules/TaskCounter";
import TaskForm from "@/components/molecules/TaskForm";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [activePriorityFilter, setActivePriorityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Debounce search query for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
    const filtered = tasks.filter(task => {
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

      // Search filter
      let searchMatch = true;
      if (debouncedSearchQuery.trim()) {
        const query = debouncedSearchQuery.toLowerCase();
        searchMatch = 
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.category.toLowerCase().includes(query);
      }

      return statusMatch && priorityMatch && searchMatch;
    });

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      // Always keep completed tasks at bottom within their sort group
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      switch (sortBy) {
        case "dueDate":
          // Handle null due dates - put them at the end
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          const aPriority = priorityOrder[a.priority] || 0;
          const bPriority = priorityOrder[b.priority] || 0;
          if (aPriority !== bPriority) {
            return bPriority - aPriority; // High to low
          }
          // Secondary sort by creation date if same priority
          return new Date(b.createdAt) - new Date(a.createdAt);
        
        case "alphabetical":
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        
        case "createdAt":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return sorted;
  };

const handleStatusFilterChange = (filter) => {
    setActiveStatusFilter(filter);
  };

  const handlePriorityFilterChange = (filter) => {
    setActivePriorityFilter(filter);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
};

  const getSortLabel = (sortValue) => {
    switch (sortValue) {
      case "createdAt":
        return "Recently Created";
      case "dueDate":
        return "Due Date";
      case "priority":
        return "Priority";
      case "alphabetical":
        return "Alphabetically";
      default:
        return "Recently Created";
    }
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
            {/* Search Bar */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Search Tasks</h3>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ApperIcon name="Search" className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search by title, description, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <ApperIcon name="X" className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              {debouncedSearchQuery && (
                <p className="mt-2 text-xs text-gray-500">
                  Searching for "{debouncedSearchQuery}"
                </p>
              )}
            </div>

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

            {/* Sort Options */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Sort Tasks</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={sortBy === "dueDate" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSortChange("dueDate")}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Calendar" size={16} />
                  Due Date
                </Button>
                <Button
                  variant={sortBy === "priority" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSortChange("priority")}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="AlertCircle" size={16} />
                  Priority
                </Button>
                <Button
                  variant={sortBy === "createdAt" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSortChange("createdAt")}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Clock" size={16} />
                  Created Date
                </Button>
                <Button
                  variant={sortBy === "alphabetical" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSortChange("alphabetical")}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="AlphabeticalOrder" size={16} />
                  Alphabetical
                </Button>
              </div>
            </div>
          </div>
          {/* Sort Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
            >
              <ApperIcon name="ArrowUpDown" size={16} />
              Sort: {getSortLabel(sortBy)}
              <ApperIcon 
                name={showSortDropdown ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="text-gray-500"
              />
            </Button>
            
            {showSortDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  {[
                    { value: "createdAt", label: "Recently Created", icon: "Clock" },
                    { value: "dueDate", label: "Due Date", icon: "Calendar" },
                    { value: "priority", label: "Priority", icon: "Flag" },
                    { value: "alphabetical", label: "Alphabetically", icon: "SortAsc" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        handleSortChange(option.value);
                        setShowSortDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors",
                        sortBy === option.value ? "bg-accent/10 text-accent font-medium" : "text-gray-700"
                      )}
                    >
                      <ApperIcon name={option.icon} size={16} />
                      {option.label}
                      {sortBy === option.value && (
                        <ApperIcon name="Check" size={16} className="ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
            searchQuery={debouncedSearchQuery}
            sortBy={sortBy}
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