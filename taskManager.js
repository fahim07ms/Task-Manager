// Collecting the necessary Objects from the DOM
const messageContainer = document.getElementById("message");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskPriority = document.getElementById("taskPriority");
const submitBtn = document.getElementById("taskSubmitBtn");
const taskList = document.getElementById("taskList");

// BluePrint of a Task
class Task {
  // Task Properties
  #id;
  _title;
  _description;
  _priority;
  #dateCreated;
  _lastModified;
  _isCompleted;

  constructor(title, description = "", priority, isCompleted = false) {
    this.#id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.#dateCreated = new Date();
    this.lastModified = new Date();
    this.isCompleted = isCompleted;
  }

  // Getters
  get id() {
    return this.#id;
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

  get priority() {
    return this._priority;
  }

  get dateCreated() {
    return this.#dateCreated;
  }

  get lastModified() {
    return this._lastModified;
  }

  get isCompleted() {
    return this._isCompleted;
  }

  // Setters
  set title(title) {
    title = title.trim();
    if (title === "" || typeof title !== "string") {
      throw new Error("Invalid title");
    } else {
      this._title = title;
    }
  }

  set description(description) {
    description = description.trim();
    if (typeof description !== "string") {
      throw new Error("Invalid description");
    }

    this._description = description;
  }

  set priority(priority) {
    const priorities = ["low", "medium", "high"];
    if (typeof priority !== "string" && priorities.indexOf(priority) === -1) {
      throw new Error("Invalid priority");
    }

    this._priority = priority;
  }

  set lastModified(newDate) {
    if (isNaN(new Date(newDate)) && newDate) {
      throw new Error("Invalid Date Format");
    }

    this._lastModified = newDate;
  }

  set isCompleted(isCompleted) {
    isCompleted = !isCompleted;
  }

  // JSON format of the task
  toJSON() {
    return {
      id: this.#id,
      dateCreated: this.#dateCreated,
      ...this,
    };
  }
}

// Show Message in the message container
const showMessage = (msg, type) => {
  // Set message container color according to message type
  if (type === "success") messageContainer.style.backgroundColor = "#56a659e8";
  else if (type === "error")
    messageContainer.style.backgroundColor = "#a65656e8";
  else messageContainer.style.backgroundColor = "#e3df6ee8";

  // Make it visible
  messageContainer.style.visibility = "visible";
  messageContainer.innerText = msg;

  // Hide it after 3 secs
  setTimeout(() => {
    messageContainer.style.visibility = "hidden";
  }, 3000);
};

// Load Local Storage Data
// If no data, then provide a empty array
const localData = JSON.parse(localStorage.getItem("tasks"));
let tasks = localData ? localData : [];

// Add Task
const addTask = (title, description, priority) => {
  try {
    // Create a new task
    const task = new Task(title, description, priority);

    // Push it in the tasks array and modify localStorage
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (err) {
    // Show error message if any
    showMessage(err, "error");
  }
};

// Delete Task
const deleteTask = (taskId) => {
  // Filter out the tasks and modify the localStorage
  tasks = tasks.filter((task) => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Update Task
const updateTask = (taskId, updates) => {};

// Toggle Task Completion
const toggleTaskCompletion = (taskId) => {
  
};

// EventListeners
document.addEventListener("DOMContentLoaded", () => {
  submitBtn.addEventListener("click", (event) => {
    event.preventDefault();

    addTask(taskTitle.value, taskDescription.value, taskPriority.value);
  });
});
