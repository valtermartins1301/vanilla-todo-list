export default class TodoUI {
    constructor() {
        this.elements = this.getElements();
    }

    // Get all DOM elements
    getElements() {
        return {
            todoForm: document.getElementById('todoForm'),
            todoInput: document.getElementById('todoInput'),
            todoList: document.getElementById('todoList'),
            emptyState: document.getElementById('emptyState'),
            todoStats: document.getElementById('todoStats'),
            activeCount: document.getElementById('activeCount'),
            clearCompleted: document.getElementById('clearCompleted'),
            filterButtons: document.querySelectorAll('.filter-btn')
        };
    }

    // Render todo list
    renderTodos(todos) {
        this.elements.todoList.innerHTML = '';
        
        if (todos.length === 0) {
            this.showEmptyState();
        } else {
            this.hideEmptyState();
            todos.forEach(todo => {
                const todoElement = this.createTodoElement(todo);
                this.elements.todoList.appendChild(todoElement);
            });
        }
    }

    // Create a single todo element
    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'todo-item--completed' : ''}`;
        li.dataset.id = todo.id;

        li.innerHTML = `
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                aria-label="Mark todo as ${todo.completed ? 'incomplete' : 'complete'}"
            >
            <span class="todo-text">${this.escapeHtml(todo.text)}</span>
            <button class="todo-delete" aria-label="Delete todo">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        `;

        return li;
    }

    // Update todo stats
    updateStats(activeCount, totalCount) {
        this.elements.activeCount.textContent = activeCount;
        
        if (totalCount > 0) {
            this.elements.todoStats.style.display = 'flex';
        } else {
            this.elements.todoStats.style.display = 'none';
        }
    }

    // Show empty state
    showEmptyState() {
        this.elements.emptyState.style.display = 'block';
        this.elements.todoList.style.display = 'none';
    }

    // Hide empty state
    hideEmptyState() {
        this.elements.emptyState.style.display = 'none';
        this.elements.todoList.style.display = 'block';
    }

    // Update filter buttons
    updateFilterButtons(activeFilter) {
        this.elements.filterButtons.forEach(btn => {
            btn.classList.remove('filter-btn--active');
            if (btn.dataset.filter === activeFilter) {
                btn.classList.add('filter-btn--active');
            }
        });
    }

    // Add completed class to todo item
    markTodoCompleted(id) {
        const todoItem = this.elements.todoList.querySelector(`[data-id="${id}"]`);
        if (todoItem) {
            todoItem.classList.add('todo-item--completed');
        }
    }

    // Remove completed class from todo item
    markTodoIncomplete(id) {
        const todoItem = this.elements.todoList.querySelector(`[data-id="${id}"]`);
        if (todoItem) {
            todoItem.classList.remove('todo-item--completed');
        }
    }

    // Remove todo item with animation
    removeTodoItem(id) {
        const todoItem = this.elements.todoList.querySelector(`[data-id="${id}"]`);
        if (todoItem) {
            todoItem.classList.add('todo-item--removing');
            setTimeout(() => {
                if (todoItem.parentNode) {
                    todoItem.parentNode.removeChild(todoItem);
                }
            }, 300);
        }
    }

    // Clear input field
    clearInput() {
        this.elements.todoInput.value = '';
        this.elements.todoInput.focus();
    }

    // Get input value
    getInputValue() {
        return this.elements.todoInput.value;
    }

    // Focus input
    focusInput() {
        this.elements.todoInput.focus();
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Show notification (optional enhancement)
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        // Get Material Design colors based on type
        const getNotificationColors = (type) => {
            switch (type) {
                case 'success':
                    return {
                        background: 'var(--md-sys-color-success)',
                        color: 'var(--md-sys-color-on-success)'
                    };
                case 'error':
                    return {
                        background: 'var(--md-sys-color-error)',
                        color: 'var(--md-sys-color-on-error)'
                    };
                default:
                    return {
                        background: 'var(--md-sys-color-primary)',
                        color: 'var(--md-sys-color-on-primary)'
                    };
            }
        };
        
        const colors = getNotificationColors(type);
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: var(--md-sys-shape-corner-small);
            color: ${colors.color};
            font-weight: 500;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            background: ${colors.background};
            box-shadow: var(--md-sys-elevation-level-3);
            font-family: var(--md-ref-typeface-brand), var(--md-ref-typeface-plain), sans-serif;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
} 