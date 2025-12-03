document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const emptyImage = document.querySelector(".empty-image");
  const todosContainer = document.querySelector(".todos-container");
  const progressBar = document.getElementById("progress");
  const progressNumbers = document.getElementById("numbers");

  const toggleEmptyState = () => {
    emptyImage.classList.toggle("hidden", taskList.children.length !== 0);
    todosContainer.classList.toggle("wide", taskList.children.length > 0);
  };

  const updateProgres = (checkCompletion = true) => {
    const totalTask = taskList.children.length;
    const completeTasks = taskList.querySelectorAll(".checkbox:checked").length;
    progressBar.style.width = totalTask
      ? `${(completeTasks / totalTask) * 100}% `
      : `0%`;
    progressNumbers.textContent = `${completeTasks} / ${totalTask}`;

    if (checkCompletion && totalTask > 0 && completeTasks === totalTask) {
      Confetti();
    }
  };

  const saveTaskToLocalStorage = () => {
    const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
      text: li.querySelector("span").textContent,
      completed: li.querySelector(".checkbox").checked
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const loadTasksFromLocalStorage = () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(({text, completed}) => addTask(text, completed, false));
    toggleEmptyState();
  updateProgres();
  };

  const addTask = (text, completed = false, checkCompletion = true) => {
    const taskText = text || taskInput.value.trim();
    if (!taskText) {
      return;
    }

    const li = document.createElement("li");
    li.innerHTML = `
    <input type="checkbox" class="checkbox" ${completed ? "checked" : ""}>
    <span>${taskText}</span>
    <div class="task-buttons">
       <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
       <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
    </div>
    `;

    const checkbox = li.querySelector(".checkbox");
    const editBtn = li.querySelector(".edit-btn");

    if (completed) {
      li.classList.add("completed");
      editBtn.disabled = true;
      editBtn.classList.add("deactivate");
    }

    checkbox.addEventListener("change", () => {
      const isChecked = checkbox.checked;
      li.classList.toggle("completed", isChecked);
      editBtn.disabled = isChecked;
      editBtn.classList.toggle("deactivate", isChecked);
      updateProgres();
      saveTaskToLocalStorage();
    });

    editBtn.addEventListener("click", () => {
      if (!checkbox.checked) {
        taskInput.value = li.querySelector("span").textContent;
        li.remove();
        toggleEmptyState();
        updateProgres(false);
        saveTaskToLocalStorage();
      }
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      li.remove();
      toggleEmptyState();
      updateProgres();
      saveTaskToLocalStorage();
    });

    taskList.appendChild(li);
    taskInput.value = "";
    toggleEmptyState();
    updateProgres(checkCompletion);
    saveTaskToLocalStorage();
  };

  addTaskBtn.addEventListener("click", () => addTask());
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      addTask();
    }
  });

  loadTasksFromLocalStorage();
});

//COnfeti
const Confetti = () => {
  const count = 200,
    defaults = {
      origin: { y: 0.7 },
    };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};
