import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TaskCounter = ({ tasks = [], filteredTasks = null, activeStatusFilter = "all", activePriorityFilter = "all", className, ...props }) => {
  // Use filtered tasks for display counts when filters are active, otherwise use all tasks
  const displayTasks = filteredTasks || tasks;
  const isFiltered = activeStatusFilter !== "all" || activePriorityFilter !== "all";
  
  const totalTasks = displayTasks.length;
  const completedTasks = displayTasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate additional filtered metrics
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueTodayTasks = displayTasks.filter(task => {
    const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
    return taskDueDate && taskDueDate.getTime() === today.getTime() && !task.completed;
  }).length;
  
  const overdueTasks = displayTasks.filter(task => {
    const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
    return taskDueDate && taskDueDate < today && !task.completed;
  }).length;

  const highPriorityTasks = displayTasks.filter(task => task.priority === "high" && !task.completed).length;

  return (
    <div className={cn("bg-white rounded-2xl p-6 shadow-subtle border border-gray-100", className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Task Overview</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ApperIcon name="BarChart3" className="h-4 w-4" />
          <span>{completionPercentage}% Complete</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 mb-2">
            <ApperIcon name="ListTodo" className="h-6 w-6 text-blue-600 mx-auto" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalTasks}</div>
          <div className="text-sm text-gray-500">Total Tasks</div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 mb-2">
            <ApperIcon name="Clock" className="h-6 w-6 text-orange-600 mx-auto" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{activeTasks}</div>
          <div className="text-sm text-gray-500">Active</div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 mb-2">
            <ApperIcon name="CheckCircle" className="h-6 w-6 text-green-600 mx-auto" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{completedTasks}</div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
      </div>

      {totalTasks > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCounter;