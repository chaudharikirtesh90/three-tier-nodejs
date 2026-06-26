document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const taskCount = document.getElementById('task-count');
    
    // Base URL for the API (assuming it's hosted on the same server)
    const API_URL = '/api/tasks';

    // Fetch and display tasks on load
    fetchTasks();

    // Event Listeners
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = taskInput.value.trim();
        
        if (title) {
            await addTask(title);
            taskInput.value = '';
        }
    });

    // API Interactions

    async function fetchTasks() {
        try {
            const response = await fetch(API_URL);
            const result = await response.json();
            
            if (response.ok) {
                renderTasks(result.data);
            } else {
                console.error('Failed to fetch tasks:', result.error);
                taskList.innerHTML = `<li class="empty-state" style="color: var(--danger);">Failed to load tasks.</li>`;
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            taskList.innerHTML = `<li class="empty-state" style="color: var(--danger);">Could not connect to the server. Is the Node.js backend running?</li>`;
        }
    }

    async function addTask(title) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title })
            });
            
            if (response.ok) {
                await fetchTasks(); // Refresh the list
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    async function toggleTask(id, currentStatus) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed: !currentStatus })
            });
            
            if (response.ok) {
                await fetchTasks(); // Refresh the list
            }
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    }

    async function deleteTask(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                await fetchTasks(); // Refresh the list
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    // UI Rendering

    function renderTasks(tasks) {
        // Update count
        const count = tasks.length;
        taskCount.textContent = `${count} task${count !== 1 ? 's' : ''}`;

        // Clear list
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            taskList.innerHTML = `<li class="empty-state">No tasks yet. Add one above!</li>`;
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="task-content">
                    <div class="checkbox ${task.completed ? 'checked' : ''}" data-id="${task.id}" data-status="${task.completed}"></div>
                    <span class="task-text">${escapeHTML(task.title)}</span>
                </div>
                <button class="delete-btn" data-id="${task.id}" aria-label="Delete task">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            `;
            
            taskList.appendChild(li);
        });

        // Attach event listeners to newly created elements
        document.querySelectorAll('.checkbox').forEach(box => {
            box.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const status = e.target.getAttribute('data-status') === '1' || e.target.getAttribute('data-status') === 'true';
                toggleTask(id, status);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                // Optional: add a tiny animation before deleting
                e.currentTarget.parentElement.style.opacity = '0';
                e.currentTarget.parentElement.style.transform = 'translateY(10px)';
                setTimeout(() => deleteTask(id), 200);
            });
        });
    }

    // Utility to prevent XSS
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
