const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

let allTodos = getTodos();
updateTodoList();

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo();
});

function addTodo() {
  const todoText = todoInput.value.trim();

  if (todoText.length > 0) {
    const todoObject = {
      text: todoText,
      completed: false,
    };
    allTodos.push(todoObject);
    saveTodos();
    updateTodoList();

    // Animate the last added item
    const lastItem = todoList.lastElementChild;
    lastItem.classList.add('animate__animated', 'animate__fadeInDown');
    lastItem.addEventListener('animationend', () => {
      lastItem.classList.remove('animate__animated', 'animate__fadeInDown');
    }, { once: true });

    todoInput.value = "";
  }
}

function updateTodoList() {
    // Clear the list only if there are changes
    const todoItems = allTodos.map((todo, index) => createTodoItem(todo, index));
  
    // Clear existing todo list
    todoList.innerHTML = "";
  
    // If no todos, show a message
    if (allTodos.length === 0) {
      const noTasksMessage = document.createElement("p");
      noTasksMessage.className = "no-tasks-message";
      noTasksMessage.textContent = "No tasks added yet!";
      todoList.appendChild(noTasksMessage);
    } else {
      // Otherwise, append all items at once
      todoList.append(...todoItems);

      // Animate entire list loading
  todoList.classList.add('animate__animated', 'animate__fadeIn');
  todoList.addEventListener('animationend', () => {
    todoList.classList.remove('animate__animated', 'animate__fadeIn');
  }, { once: true });
    }
  }
  

function createTodoItem(todo, todoIndex) {
  const todoId = `todo-${todoIndex}`;
  const todoLI = document.createElement("li");
  todoLI.className = "todo-item";
  todoLI.dataset.index = todoIndex;

  todoLI.innerHTML = `
    <input type="checkbox" id="${todoId}" ${todo.completed ? 'checked' : ''}>
    <label class="custom-checkbox" for="${todoId}">
        <svg xmlns="http://www.w3.org/2000/svg" fill="transparent" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
        </svg>
    </label>
    <label for="${todoId}" class="todo-text">${todo.text}</label>
    <button class="edit-btn">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M160-400v-80h280v80H160Zm0-160v-80h440v80H160Zm0-160v-80h440v80H160Zm360 560v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z"/></svg>
    </button>
    <button class="delete-btn">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>
    </button>
  `;

  // Delete button
  const deleteBtn = todoLI.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    deleteTodoItem(todoIndex);
  });

  // Edit button
  const editBtn = todoLI.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => {
    toggleEditMode(todoIndex, editBtn);
  });

  const checkbox = todoLI.querySelector("input");
  checkbox.addEventListener("change", () => {
    allTodos[todoIndex].completed = checkbox.checked;
    saveTodos();
  });

  return todoLI;
}

function deleteTodoItem(todoIndex) {
  const todoItem = document.querySelector(`.todo-item[data-index="${todoIndex}"]`);
  
  // Animate before deleting
  todoItem.classList.add('animate__animated', 'animate__fadeOutLeft');
  todoItem.addEventListener('animationend', () => {
    allTodos.splice(todoIndex, 1);
    saveTodos();
    updateTodoList();
  }, { once: true });
}

function saveTodos() {
  const todosJson = JSON.stringify(allTodos);
  localStorage.setItem("todos", todosJson);
}

function getTodos() {
  const todos = localStorage.getItem("todos");
  return todos ? JSON.parse(todos) : [];
}

function toggleEditMode(todoIndex, editBtn) {
    const todoItem = document.querySelector(`.todo-item[data-index="${todoIndex}"]`);
    const todoTextLabel = todoItem.querySelector(".todo-text");
    const deleteBtn = todoItem.querySelector(".delete-btn");
    const checkbox = todoItem.querySelector('input[type="checkbox"]');
    const customCheckbox = todoItem.querySelector(".custom-checkbox");
  
    // Hide delete button and checkbox
    deleteBtn.style.display = "none";
    checkbox.style.display = "none";
    customCheckbox.style.display = "none";
  
    // Remove the 'for' attribute temporarily
    todoTextLabel.removeAttribute("for");
  
    // Make label editable
    todoTextLabel.setAttribute("contenteditable", "true");
    todoTextLabel.focus();
    todoTextLabel.style.border = "2px solid var(--accent-color)";
    todoTextLabel.style.borderRadius = "20px";
    todoTextLabel.style.padding = "10px";
  
    // Animate entering edit mode (UPDATED animation)
    todoTextLabel.classList.add('animate__animated', 'animate__pulse');
    todoTextLabel.addEventListener('animationend', () => {
      todoTextLabel.classList.remove('animate__animated', 'animate__pulse');
    }, { once: true });
  
    // Change edit button to Save button
    editBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00ffc4">
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
      </svg>
    `;
  
    const saveChanges = () => {
      todoTextLabel.removeAttribute("contenteditable");
      todoTextLabel.style.border = "none";
      todoTextLabel.style.padding = "15px";
  
      // Restore the 'for' attribute
      todoTextLabel.setAttribute("for", checkbox.id);
  
      allTodos[todoIndex].text = todoTextLabel.textContent.trim();
      saveTodos();
      updateTodoList();
  
      // Animate after saving
      setTimeout(() => {
        const savedItem = document.querySelector(`.todo-item[data-index="${todoIndex}"]`);
        if (savedItem) {
          savedItem.classList.add('animate__animated', 'animate__bounceIn');
          savedItem.addEventListener('animationend', () => {
            savedItem.classList.remove('animate__animated', 'animate__bounceIn');
          }, { once: true });
        }
      }, 100);
    };
  
    todoTextLabel.addEventListener("blur", saveChanges);
    todoTextLabel.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevent new line
        saveChanges();
      }
    });
  }
  