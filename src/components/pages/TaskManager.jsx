import { useState } from "react";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import TaskForm from "@/components/molecules/TaskForm";
import TaskCounter from "@/components/molecules/TaskCounter";
import TaskList from "@/components/organisms/TaskList";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
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
          <TaskCounter tasks={tasks} />
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