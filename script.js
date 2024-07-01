document.addEventListener('DOMContentLoaded', loadTasks);
document.querySelector('#task-form').addEventListener('submit', addTask);
document.querySelector('#task-list').addEventListener('click', modifyTask);
document.querySelector('#toggle-btn').addEventListener('click', toggleSidebar);

function addTask(e) {
    e.preventDefault();
    const taskInput = document.querySelector('#task-input');
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const taskList = document.querySelector('#task-list');
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
        <span>${taskText}</span>
        <div>
            <button class="view" aria-label="View Task"><i class="fas fa-eye"></i></button>
            <button class="edit" aria-label="Edit Task"><i class="fas fa-edit"></i></button>
            <button class="delete" aria-label="Delete Task"><i class="fas fa-trash"></i></button>
            <button class="toggle-completed" aria-label="Toggle Complete Task"><i class="fas fa-check"></i></button>
        </div>
    `;

    taskList.appendChild(taskItem);
    storeTask(taskText, false);
    taskInput.value = '';
}

function modifyTask(e) {
    const taskItem = e.target.closest('li');
    const taskTextElement = taskItem.querySelector('span');

    if (e.target.closest('button').classList.contains('view')) {
        alert(`Task: ${taskTextElement.textContent}`);
    } else if (e.target.closest('button').classList.contains('edit')) {
        const newTaskText = prompt('Edit your task:', taskTextElement.textContent);
        if (newTaskText) {
            taskTextElement.textContent = newTaskText;
            updateTaskInLocalStorage(taskItem, newTaskText);
        }
    } else if (e.target.closest('button').classList.contains('delete')) {
        if (confirm('Are you sure you want to delete this task?')) {
            taskItem.remove();
            removeTaskFromLocalStorage(taskItem);
        }
    } else if (e.target.closest('button').classList.contains('toggle-completed')) {
        taskTextElement.classList.toggle('completed');
        toggleTaskCompletionInLocalStorage(taskItem);
    }
}

function storeTask(taskText, completed) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, completed: completed });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskList = document.querySelector('#task-list');
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
            <div>
                <button class="view" aria-label="View Task"><i class="fas fa-eye"></i></button>
                <button class="edit" aria-label="Edit Task"><i class="fas fa-edit"></i></button>
                <button class="delete" aria-label="Delete Task"><i class="fas fa-trash"></i></button>
                <button class="toggle-completed" aria-label="Toggle Complete Task"><i class="fas fa-check"></i></button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}

function updateTaskInLocalStorage(taskItem, newTaskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => 
        task.text === taskItem.querySelector('span').textContent 
            ? { ...task, text: newTaskText } 
            : task
    );
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(taskItem) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== taskItem.querySelector('span').textContent);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleTaskCompletionInLocalStorage(taskItem) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => 
        task.text === taskItem.querySelector('span').textContent 
            ? { ...task, completed: !task.completed } 
            : task
    );
    localStorage.setItem('tasks', JSON.stringify(tasks));
}