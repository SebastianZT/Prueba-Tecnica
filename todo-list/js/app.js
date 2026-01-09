const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const counter = document.getElementById('task-counter');
const filters = document.querySelectorAll('.filters button');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();

    if (text === '') return alert('La tarea no puede estar vacía');

    tasks.push({ text, completed: false });
    input.value = '';
    saveAndRender();
});

function renderTasks() {
    list.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'completed') return task.completed;
        if (currentFilter === 'pending') return !task.completed;
        return true;
    });

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.classList.toggle('completed', task.completed);

        const span = document.createElement('span');
        span.textContent = task.text;
        span.setAttribute('aria-label', 'Marcar como completada');

        span.addEventListener('click', () => {
            task.completed = !task.completed;
            saveAndRender();
        });

        const btn = document.createElement('button');
        btn.textContent = 'Eliminar';

        btn.addEventListener('click', () => {
            if (confirm('¿Deseas eliminar esta tarea?')) {
                tasks.splice(index, 1);
                saveAndRender();
            }
        });

        li.append(span, btn);
        list.appendChild(li);
    });

    updateCounter();
}


function updateCounter() {
    const pending = tasks.filter(task => !task.completed).length;
    counter.textContent = `Tareas pendientes: ${pending}`;
}

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

filters.forEach(button => {
    button.addEventListener('click', () => {
        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

renderTasks();
