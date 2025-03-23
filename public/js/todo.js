let currentFilter = 'all';

function renderTodos(todos) {
    const todosList = document.getElementById("todosList");
    todosList.innerHTML = "";

    todos.forEach((todo) => {
        const todoElement = document.createElement("div");
        todoElement.className = "todo-item";
        
        const todoStyle = todo.completed 
            ? 'text-decoration: line-through; opacity: 0.7;' 
            : '';

        todoElement.innerHTML = `
            <span style="${todoStyle}">${todo.text}</span>
            <div>
                <button onclick="toggleTodo('${todo._id}')">
                    ${todo.completed ? '↻' : '✓'}
                </button>
                <button onclick="editTodo('${todo._id}')">✎</button>
                <button onclick="deleteTodo('${todo._id}')">×</button>
            </div>
        `;

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

function filterTodos(filterType) {
    currentFilter = filterType;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === filterType) btn.classList.add('active');
    });
    loadTodos();
}

async function updateProgress() {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/todos", {
            headers: { Authorization: `Bearer ${token}` },
        });
        
        const todos = await response.json();
        const completed = todos.filter(todo => todo.completed).length;
        const total = todos.length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        document.querySelector('.progress-fill').style.width = `${progress}%`;
        document.querySelector('.progress-text').textContent = `${progress}% Complete`;
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
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'completed') return todo.completed;
            if (currentFilter === 'active') return !todo.completed;
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
        document.querySelector('.username').textContent = data.findUser.name;
    } catch (error) {
        console.error("Error loading user profile:", error);
    }
}