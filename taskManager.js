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
    }
    this._title = title;
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
    this._isCompleted = isCompleted;
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
  messageContainer.style.display = "block";
  messageContainer.innerText = msg;

  // Hide it after 3 secs
  setTimeout(() => {
    messageContainer.style.display = "none";
    messageContainer.innerText = "";
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
    
    showMessage("Task added successfully!", "success");
  } catch (err) {
    // Show error message if any
    showMessage(err, "error");
  }

  showTasks();
};

// Delete Task
const deleteTask = (taskId) => {
  // Filter out the tasks and modify the localStorage
  tasks = tasks.filter((task) => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  showTasks();
};

// Update Task
const updateTask = (taskId, updates) => {};

// Toggle Task Completion
const toggleTaskCompletion = (taskId) => {
  // Filter out the wanted task's index
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  console.log(taskIndex)
  // Toggle its completion value
  tasks[taskIndex]._isCompleted = !tasks[taskIndex]._isCompleted;
 console.log(tasks);
  // Modify it in the localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));

};

const getPriorityColor = (priority) => {
    switch(priority)
    {
        case "high":
            return "#dc6158ce";
            break;
        case "low":
            return "#7ccb60ce";
            break;
        case "medium":
            return "#f9fe54e2";
            break;
    }
};

// Show tasks
const showTasks = () => {
    // Iterate through the tasks
    // For each task create a taskDiv
    // Add it in the `taskList` container in the HTML
    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.classList = ['task'];
        taskDiv.id = task.id;
        
        taskDiv.innerHTML = `
            <div class="taskToggle"><input ${task._isCompleted ? "checked" : "unchecked"} class="taskToggleCheckbox" type="checkbox" name="${task.id}" id="${task.id}" value="${task._isCompleted}"></div>
            <div class="taskTitleName">${(task._title.length <= 30) ? task._title : (task._title.slice(0, 30)+"...")}</div>
            <div class="taskContent">
                <form id="${task.id}" class="taskEditForm">
                    <b>Title: </b><input size="50" name="title" type="text" value="${task._title}" placeholder="Task title" required><br>
                    <b>Description: </b><br>
                    <textarea name="description" class="taskDescriptionName" placeholder="Write something...">${task._description}</textarea>
                    <button name="save-btn" class="complete-btn" type="submit">Save</button>
                    <button name="delete-btn" class="delete-btn" type="submit">Delete</button>
                </form>
            </div>
            <div class="taskPriorityName"><span style="background-color: ${getPriorityColor(task._priority)}">${task._priority[0].toUpperCase() + task._priority.slice(1)}</span></div>
        `;
        if (task._isCompleted) {
            taskDiv.classList.add("task-completed");
        }
        taskList.appendChild(taskDiv);
    });
}

// Expand the individual task when clicked
const expandTask = (taskId) => {
    // Grab the task div and the content/expandable section
    const taskDiv = document.getElementById(taskId);
    const taskContent = taskDiv.querySelector('.taskContent');

    // If not expanded than expand, else shrink
    if (taskContent.style.display === 'block') {
        taskDiv.style.height = "35px";
        taskContent.style.display = "none";
        taskContent.style.visibility = "hidden";
    } else {
        taskDiv.style.height = "400px";
        taskContent.style.display = "block";
        taskContent.style.visibility = "visible";
    }    
}

// EventListeners
document.addEventListener("DOMContentLoaded", () => {
    showTasks();
    document.querySelectorAll(".task").forEach(taskDiv => {
        taskDiv.querySelector(".taskTitleName").addEventListener("click", () => {
            expandTask(taskDiv.id);
        });
    });
})

document.addEventListener("DOMContentLoaded", () => {
  submitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    addTask(taskTitle.value, taskDescription.value, taskPriority.value);
  });

  document.querySelectorAll(".delete-btn").forEach(item => {
    item.addEventListener("click", (event) => {
        deleteTask(event.target.parentElement.id);
    })
  });

  document.querySelectorAll(".taskToggleCheckbox").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        toggleTaskCompletion(checkbox.id);
        checkbox.value = (checkbox.value == "true") ? "false" : "true";
        
        checkbox.parentElement.parentElement.classList.toggle('task-completed')
    });
  });
});

