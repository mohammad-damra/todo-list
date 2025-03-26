let currentFilter = "all";
let currentPage = 1;
const todosPerPage = 3;
let totalTodos = 0;

function renderTodos(todos) {
  const todosList = document.getElementById("todosList");
  todosList.innerHTML = "";

  // Calculate todos for current page
  const startIndex = (currentPage - 1) * todosPerPage;
  const paginatedTodos = todos.slice(startIndex, startIndex + todosPerPage);

  if (paginatedTodos.length === 0) {
    todosList.innerHTML = "<div class='no-todos'>No todos found</div>";
    return;
  }

  paginatedTodos.forEach((todo) => {
    const todoElement = document.createElement("div");
    todoElement.className = "todo-item";

    const todoStyle = todo.completed
      ? "text-decoration: line-through; opacity: 0.7;"
      : "";

    todoElement.innerHTML = `
            <span style="${todoStyle}">${todo.text}</span>
            <div>
                <button onclick="toggleTodo('${todo._id}')">
                    ${todo.completed ? "↻" : "✓"}
                </button>
                <button onclick="editTodo('${todo._id}')">✎</button>
                <button onclick="deleteTodo('${todo._id}')">×</button>
            </div>
        `;

    todosList.appendChild(todoElement);
  });
  // Render pagination controls
  renderPaginationControls(todos.length); // added
}

function renderPaginationControls(totalTodos) {
  const totalPages = Math.ceil(totalTodos / todosPerPage);
  const paginationContainer =
    document.getElementById("paginationControls") ||
    createPaginationContainer();

  paginationContainer.innerHTML = "";

  // Previous button
  const prevButton = document.createElement("button");
  prevButton.innerHTML = "&laquo;";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      loadTodos();
    }
  });
  paginationContainer.appendChild(prevButton);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.className = currentPage === i ? "active" : "";
    pageButton.addEventListener("click", () => {
      currentPage = i;
      loadTodos();
    });
    paginationContainer.appendChild(pageButton);
  }

  // Next button
  const nextButton = document.createElement("button");
  nextButton.innerHTML = "&raquo;";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      loadTodos();
    }
  });
  paginationContainer.appendChild(nextButton);
}

function createPaginationContainer() {
  const container = document.createElement("div");
  container.id = "paginationControls";
  container.className = "pagination";
  document.getElementById("todosList").after(container);
  return container;
}
async function addTodo() {
  const text = document.getElementById("todoInput").value;
  if (!text) return;

  try {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });

    if (response.ok) {
      document.getElementById("todoInput").value = "";
      currentPage = 1; // Reset to first page when adding new todo
      loadTodos();
    }
  } catch (error) {
    console.error("Error adding todo:", error);
  }
}

async function toggleTodo(id) {
  try {
    const token = localStorage.getItem("token");
    await fetch(`/api/todos/${id}/toggle`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    loadTodos();
  } catch (error) {
    console.error("Error toggling todo:", error);
  }
}

async function deleteTodo(id) {
  try {
    const token = localStorage.getItem("token");
    await fetch(`/api/todos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    loadTodos();
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

async function editTodo(id) {
  const newText = prompt("Enter the new text for the todo:");
  if (!newText) return;

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: newText }),
    });

    if (response.ok) {
      loadTodos();
    }
  } catch (error) {
    console.error("Error editing todo:", error);
  }
}

function filterTodos(filterType) {
  currentFilter = filterType;
  currentPage = 1; // Reset to first page when changing filter
  loadTodos();
}

async function updateProgress() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/todos", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const todos = await response.json();
    const completed = todos.filter((todo) => todo.completed).length;
    const total = todos.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    document.querySelector(".progress-fill").style.width = `${progress}%`;
    document.querySelector(
      ".progress-text"
    ).textContent = `${progress}% Complete`;
  } catch (error) {
    console.error("Error updating progress:", error);
  }
}

async function loadTodos() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/todos", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 401 || response.status === 403) {
      window.location.href = "./login.html";
      return;
    }

    const todos = await response.json();
    const filteredTodos = todos.filter((todo) => {
      if (currentFilter === "completed") return todo.completed;
      if (currentFilter === "active") return !todo.completed;
      return true;
    });

    renderTodos(filteredTodos);
    updateProgress();
  } catch (error) {
    console.error("Error loading todos:", error);
  }
}

async function loadUserProfile() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    document.querySelector(".username").textContent = data.findUser.name;
  } catch (error) {
    console.error("Error loading user profile:", error);
  }
}
