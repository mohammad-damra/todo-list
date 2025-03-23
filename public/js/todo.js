async function loadTodos() {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/todos", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401 || response.status === 403) {
            window.location.href = "./login.html";
            return;
        }

        const todos = await response.json();
        renderTodos(todos);
    } catch (error) {
        console.error("Error loading todos:", error);
    }
}

function renderTodos(todos) {
    const todosList = document.getElementById("todosList");
    todosList.innerHTML = "";

    todos.forEach((todo) => {
        const todoElement = document.createElement("div");
        todoElement.className = "todo-item";
        todoElement.innerHTML = `
            <span>${todo.text}</span>
            <div>
                <button onclick="toggleTodo('${todo._id}')">✓</button>
                <button onclick="editTodo('${todo._id}')">✎</button>
                <button onclick="deleteTodo('${todo._id}')">×</button>
            </div>
        `;
        if (todo.completed) {
            todoElement.style.textDecoration = "line-through";
            todoElement.style.opacity = "0.7";
        }
        todosList.appendChild(todoElement);
    });
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