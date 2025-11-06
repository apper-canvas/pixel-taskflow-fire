const STORAGE_KEY = "taskflow-tasks";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Load tasks from localStorage
const loadTasks = () => {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    return storedTasks ? JSON.parse(storedTasks) : [];
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error);
    return [];
  }
};

// Save tasks to localStorage
const saveTasks = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
};

// Generate unique ID
const generateId = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const taskService = {
  async getAll() {
    await delay(200);
    return [...loadTasks()];
  },

  async getById(id) {
    await delay(150);
    const tasks = loadTasks();
    return tasks.find(task => task.id === id) || null;
  },

async create(taskData) {
    await delay(300);
    const tasks = loadTasks();
    const newTask = {
      id: generateId(),
      title: taskData.title.trim(),
      description: taskData.description ? taskData.description.trim() : "",
      dueDate: taskData.dueDate || null,
      priority: taskData.priority || "Medium",
      category: taskData.category || "Personal",
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasks(tasks);
    return { ...newTask };
  },

async update(id, updateData) {
    await delay(250);
    const tasks = loadTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      ...updateData,
      id: id, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString()
    };
    
    tasks[taskIndex] = updatedTask;
    saveTasks(tasks);
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(200);
    const tasks = loadTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    if (filteredTasks.length === tasks.length) {
      throw new Error("Task not found");
    }
    saveTasks(filteredTasks);
    return true;
  },

  async toggleComplete(id) {
    await delay(200);
    const tasks = loadTasks();
    const task = tasks.find(task => task.id === id);
    if (!task) {
      throw new Error("Task not found");
    }
    
    const updatedTask = {
      ...task,
      completed: !task.completed,
      updatedAt: new Date().toISOString()
    };
    
    const taskIndex = tasks.findIndex(t => t.id === id);
    tasks[taskIndex] = updatedTask;
    saveTasks(tasks);
    return { ...updatedTask };
  }
};