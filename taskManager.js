// Collecting the necessary Objects from the DOM
const messageContainer = document.getElementById("message");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskPriority = document.getElementById("taskPriority");
const taskDueDate = document.querySelector("#taskDueDate");
const submitBtn = document.getElementById("taskSubmitBtn");
const taskList = document.getElementById("taskList");
const filterBy = document.querySelector("#filterBy");

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
  _dueDate;

  constructor(title, description = "", priority, isCompleted = false, dueDate) {
    this.#id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.#dateCreated = new Date();
    this.lastModified = new Date();
    this.isCompleted = isCompleted;
    this.dueDate = dueDate;
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

  get dueDate() {
    return this._dueDate;
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

  set dueDate(date) {
    this._dueDate = new Date(date);
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
let sortedTasks = [];

// Add Task
const addTask = (title, description, priority, dueDate = null) => {
  try {
    // Create a new task
    const task = new Task(title, description, priority, false, dueDate);

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
const updateTask = (taskId, updates) => {
  // Grab the task
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updates,
    _lastModified: new Date(),
  };

  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Toggle Task Completion
const toggleTaskCompletion = (taskId) => {
  // Filter out the wanted task's index
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  // Toggle its completion value
  tasks[taskIndex]._isCompleted = !tasks[taskIndex]._isCompleted;

  // Modify it in the localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "btn-high";
      break;
    case "medium":
      return "btn-medium";
      break;
    case "low":
      return "btn-low";
      break;
  }
};

// Show tasks
const showTasks = (tasklist = tasks) => {
  while (taskList.children.length > 1) {
    taskList.removeChild(taskList.lastElementChild);
  }

  if (tasklist.length === 0) {
    return;
  }
  // Delete the task listing except the first one
  // Iterate through the tasks
  tasklist.forEach((task) => {
    // For each task create a taskDiv with class `task`
    const taskDiv = document.createElement("div");
    taskDiv.classList = ["task"];

    // Set it's id to task's id
    taskDiv.id = task.id;

    // Due time
    let dueDate = new Date(task._dueDate).toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    let isoDate =
      (dueDate != "Jan 01, 1970, 06:00 AM")
        ? new Date(task._dueDate).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16);

    // Add necessary HTML for the tasks
    taskDiv.innerHTML = `
            <div class="taskToggle">
                <input ${task._isCompleted ? "checked" : "unchecked"} 
                class="taskToggleCheckbox" 
                type="checkbox" 
                name="${task.id}" 
                id="${task.id}" 
                value="${task._isCompleted}">
            </div>
           
            <div class="taskTitleName">${
              task._title.length <= 30
                ? task._title
                : task._title.slice(0, 30) + "..."
            }<br>
                <span class="taskTitleDueDate">${
                  dueDate != "Jan 01, 1970, 06:00 AM" ? dueDate : ""
                }</span>
            </div>

            <div class="taskContent">
                <form id="${task.id}" class="taskEditForm">
                    <b>Title: </b><input size="45" class="editTitleInput" name="title" type="text" value="${
                      task._title
                    }" placeholder="Task title" required><br>
                    <b>Description: </b><br>
                    <textarea name="description" class="taskDescriptionName" placeholder="Write something...">${
                      task._description
                    }</textarea>
                    <label for="taskDueDate">Due date: </label>
                    <input class="editDueDate" value="${isoDate}" type="datetime-local">
                    <button name="save-btn" class="save-btn" type="submit">Save</button>
                    <button name="delete-btn" class="delete-btn" type="submit">Delete</button>
                </form>
            </div>
            <div class="taskPriorityName">
                <button class="${getPriorityColor(
                  task._priority
                )} prioritySelectBtn">
                    ${task._priority[0].toUpperCase() + task._priority.slice(1)}
                </button>
                <div id="priorityDropdown-${task.id}" class="dropdown-content">
                    <a href="." class="dropdownContentBtn" data-priority="high">High</a>
                    <a href="." class="dropdownContentBtn" data-priority="medium">Medium</a>
                    <a href="." class="dropdownContentBtn" data-priority="low">Low</a>
                </div>
            </div>
        `;
    // If the task is completed, add task-completedt to the class
    if (task._isCompleted) {
      taskDiv.classList.add("task-completed");
    }

    // Add it in the `taskList` container in the HTML
    taskList.appendChild(taskDiv);
  });
};

// Expand the individual task when clicked
const expandTask = (taskId) => {
  // Grab the task div and the content/expandable section
  const taskDiv = document.getElementById(taskId);
  const taskContent = taskDiv.querySelector(".taskContent");

  // If not expanded than expand, else shrink
  if (taskContent.style.display === "block") {
    taskDiv.style.height = "75px";
    taskDiv.style.gridTemplateRows = "auto 0fr";
    taskContent.style.visibility = "hidden";
    taskContent.style.display = "none";
  } else {
    taskDiv.style.height = "448px";
    taskDiv.style.gridTemplateRows = "auto 1fr";
    taskContent.style.display = "block";
    taskContent.style.visibility = "visible";
  }
};

// Filtering tasks
const filter = (sortValue) => {
  // If none then show all tasks
  // Else show filtered tasks
  if (sortValue === "none") {
    sortedTasks = tasks;
  } else {
    sortedTasks = tasks.filter((task) => task._priority === sortValue);
  }

  showTasks(sortedTasks);
};

// Listens if a task is clicked for expansion or collapse and do according to that
const taskClicked = () => {
  document.querySelectorAll(".task").forEach((taskDiv) => {
    taskDiv.querySelector(".taskTitleName").addEventListener("click", () => {
      expandTask(taskDiv.id);
    });
  });
};

// Listens if submit button is clicked for adding new task
// If clicked it adds the task
const addTaskSubmitBtnClick = () => {
  submitBtn.addEventListener("click", (event) => {
    addTask(
      taskTitle.value,
      taskDescription.value,
      taskPriority.value,
      taskDueDate.value
    );
  });
};

// Listens if a task is deleted or not
// If done then it deletes it
const taskDeleteBtnClick = () => {
  document.querySelectorAll(".delete-btn").forEach((item) => {
    item.addEventListener("click", (event) => {
      deleteTask(event.target.parentElement.id); // Button's parent element has task id
    });
  });
};

// Listens if a task is checked for completion or not
const taskCompleteCheck = () => {
  document.querySelectorAll(".taskToggleCheckbox").forEach((checkbox) => {
    // Listen when a checkbox was changed
    checkbox.addEventListener("change", () => {
      // Send the task id to change data
      toggleTaskCompletion(checkbox.id);

      // Chnage value in checkbox
      checkbox.value = checkbox.value == "true" ? "false" : "true";

      // Toggle checked / unchecked task for style
      checkbox.parentElement.parentElement.classList.toggle("task-completed");
    });
  });
};

// Listens if something edited in the task and is saved
// If so, then it saves the updated task
const saveEditedTaskBtn = () => {
  document.querySelectorAll(".save-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Grab the form and the edited contents
      const editForm = btn.parentElement;
      const editedTitle = editForm.querySelector(".editTitleInput").value;
      const editedDescription = editForm.querySelector(
        ".taskDescriptionName"
      ).value;
      const editedDueDate = editForm.querySelector(".editDueDate").value;

      const updates = {
        _title: editedTitle,
        _description: editedDescription,
        _dueDate: editedDueDate,
      };

      updateTask(editForm.id, updates);
    });
  });
};

// If a priority button is clicked, it shows the dropdown
const priorityBtnClick = () => {
  // Listen when a priority button was clicked to let the user select priority from options
  document.querySelectorAll(".prioritySelectBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.nextElementSibling.classList.toggle("show");
    });
  });

  // If user clicks outside of dropdown box close the box
  window.addEventListener("click", (event) => {
    if (!event.target.matches(".prioritySelectBtn")) {
      let dropdowns = document.getElementsByClassName("dropdown-content");
      for (let openDropdown of dropdowns) {
        if (openDropdown.classList.contains("show")) {
          openDropdown.classList.remove("show");
        }
      }
    }
  });
};

// If priority changes for any task it updates it
const priorityChange = () => {
  document.querySelectorAll(".dropdownContentBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      //  Grab the task id from the form
      const taskId = btn.parentElement.id.slice(17);

      // Store necessary information and pass it to the updateTask Func.
      const updates = {
        _priority: btn.dataset.priority,
      };
      updateTask(taskId, updates);
    });
  });
};

// Listens if filter is changed or not
// If changed then show the filtered task
const changeFilter = () => {
  filterBy.addEventListener("change", () => {
    filter(filterBy.value);
  });
};

// EventListeners
document.addEventListener("DOMContentLoaded", () => {
  // Show the tasks stored in storage
  showTasks();

  // If a task title has been clicked, expand it
  // Or if expanded, collapse it
  taskClicked();

  // Add task when the submit button clicked
  addTaskSubmitBtnClick();

  // Delete a task if delete button was clicked
  taskDeleteBtnClick();

  // Toggle checkbox for task completion
  taskCompleteCheck();

  // Save button was clicked for changing task info
  saveEditedTaskBtn();

  // Priority Btn clicked in the task
  priorityBtnClick();

  // If different priority selected from the dropdown, then update the task
  priorityChange();

  // Listen if the select option for filtering is changed or not
  // If changed then filter by value
  changeFilter();
});
