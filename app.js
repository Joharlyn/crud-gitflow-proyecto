// Variables globales
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let searchTerm = '';

// Vista: Renderizar tareas con filtros y búsqueda
function renderTasks() {
    const taskList = document.getElementById('tasks');
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        // Aplicar filtro
        if ((currentFilter === 'active' && task.completed) || 
            (currentFilter === 'completed' && !task.completed)) {
            return;
        }
        
        // Aplicar búsqueda
        if (searchTerm && !task.text.toLowerCase().includes(searchTerm.toLowerCase())) {
            return;
        }
        
        const li = document.createElement('li');
        
        // Resaltar término de búsqueda si existe
        let taskText = task.text;
        if (searchTerm) {
            const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
            taskText = taskText.replace(regex, '<span class="highlight">$1</span>');
        }
        
        li.innerHTML = `
            <span class="task-text ${task.completed ? 'completed' : ''}">${taskText}</span>
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
    updateFilterButtons();
}

// Función para escapar caracteres especiales en regex
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Actualizar estado activo de los botones de filtro
function updateFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeBtn = document.getElementById('filter' + currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1));
    if (activeBtn) activeBtn.classList.add('active');
}

// Controlador: Añadir tarea
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();
    
    if (!text) {
        alert('Por favor ingrese una tarea válida');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
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

// Controlador: Cambiar estado completado
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    
    // Añadir tarea
    document.getElementById('addTask').addEventListener('click', addTask);

    // Añadir con Enter
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Filtros
    document.getElementById('filterAll').addEventListener('click', () => {
        currentFilter = 'all';
        renderTasks();
    });

    document.getElementById('filterActive').addEventListener('click', () => {
        currentFilter = 'active';
        renderTasks();
    });

    document.getElementById('filterCompleted').addEventListener('click', () => {
        currentFilter = 'completed';
        renderTasks();
    });

    // Búsqueda
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchTerm = e.target.value.trim();
        renderTasks();
    });
});