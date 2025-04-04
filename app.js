// Modelo: Almacenamiento de datos
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Vista: Renderizar las tareas con estado de completado
function renderTasks() {
    const taskList = document.getElementById('tasks');
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <div class="task-actions">
                <button class="complete-btn" onclick="toggleComplete(${index})">
                    ${task.completed ? 'Desmarcar' : 'Completar'}
                </button>
                <button class="edit-btn" onclick="editTask(${index})">Editar</button>
                <button class="delete-btn" onclick="deleteTask(${index})">Eliminar</button>
            </div>
        `;
        taskList.appendChild(li);
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Controlador: Añadir tarea (mejorado)
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();
    
    if (!text) {
        alert('Por favor ingrese una tarea válida');
        return;
    }
    
    // Añadir ID y fecha a la tarea
    const newTask = {
        id: Date.now(),
        text: text,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    taskInput.value = '';
    renderTasks();
}

// Controlador: Eliminar tarea
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// Controlador: Editar tarea
function editTask(index) {
    const newText = prompt('Editar tarea:', tasks[index].text);
    if (newText !== null) {
        tasks[index].text = newText.trim();
        renderTasks();
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    
    // Event listener para añadir tarea
    document.getElementById('addTask').addEventListener('click', addTask);
    
    // Event listener para añadir tarea con Enter
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
}); 