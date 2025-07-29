export default class TodoController {
    constructor(store, ui) {
        this.store = store;
        this.ui = ui;
        this.bindEvents();
    }

    // Initialize the controller
    init() {
        this.renderTodos();
        this.updateStats();
        this.ui.focusInput();
    }

    // Bind all event listeners
    bindEvents() {
        // Form submission for adding todos
        this.ui.elements.todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddTodo();
        });

        // Filter button clicks
        this.ui.elements.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.handleFilterChange(filter);
            });
        });

        // Clear completed button
        this.ui.elements.clearCompleted.addEventListener('click', () => {
            this.handleClearCompleted();
        });

        // Event delegation for todo list interactions
        this.ui.elements.todoList.addEventListener('click', (e) => {
            this.handleTodoListClick(e);
        });

        // Event delegation for checkbox changes
        this.ui.elements.todoList.addEventListener('change', (e) => {
            if (e.target.classList.contains('todo-checkbox')) {
                this.handleTodoToggle(e);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    // Handle adding a new todo
    handleAddTodo() {
        const text = this.ui.getInputValue().trim();
        
        if (!text) {
            this.ui.showNotification('Please enter a task', 'error');
            return;
        }

        const todo = this.store.addTodo(text);
        this.ui.clearInput();
        this.renderTodos();
        this.updateStats();
        this.ui.showNotification('Task added successfully!', 'success');
    }

    // Handle todo toggle (complete/incomplete)
    handleTodoToggle(e) {
        const todoItem = e.target.closest('.todo-item');
        const todoId = todoItem.dataset.id;
        
        this.store.toggleTodo(todoId);
        
        if (e.target.checked) {
            this.ui.markTodoCompleted(todoId);
        } else {
            this.ui.markTodoIncomplete(todoId);
        }
        
        this.updateStats();
        this.ui.showNotification('Task updated!', 'success');
    }

    // Handle todo list clicks (delete button)
    handleTodoListClick(e) {
        if (e.target.closest('.todo-delete')) {
            const todoItem = e.target.closest('.todo-item');
            const todoId = todoItem.dataset.id;
            
            this.handleDeleteTodo(todoId);
        }
    }

    // Handle deleting a todo
    handleDeleteTodo(todoId) {
        this.store.removeTodo(todoId);
        this.ui.removeTodoItem(todoId);
        this.updateStats();
        this.ui.showNotification('Task deleted!', 'success');
    }

    // Handle filter change
    handleFilterChange(filter) {
        this.store.setFilter(filter);
        this.ui.updateFilterButtons(filter);
        this.renderTodos();
    }

    // Handle clear completed
    handleClearCompleted() {
        const completedCount = this.store.getCompletedCount();
        
        if (completedCount === 0) {
            this.ui.showNotification('No completed tasks to clear', 'info');
            return;
        }

        this.store.clearCompleted();
        this.renderTodos();
        this.updateStats();
        this.ui.showNotification(`${completedCount} completed task(s) cleared!`, 'success');
    }

    // Handle keyboard shortcuts
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + Enter to add todo
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.handleAddTodo();
        }
        
        // Escape to clear input
        if (e.key === 'Escape') {
            this.ui.clearInput();
        }
        
        // Ctrl/Cmd + / to focus input
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            this.ui.focusInput();
        }
    }

    // Render todos based on current filter
    renderTodos() {
        const filteredTodos = this.store.getFilteredTodos();
        this.ui.renderTodos(filteredTodos);
    }

    // Update statistics
    updateStats() {
        const activeCount = this.store.getActiveCount();
        const totalCount = this.store.getTotalCount();
        this.ui.updateStats(activeCount, totalCount);
    }

    // Get todos for external use
    getTodos() {
        return this.store.getAllTodos();
    }

    // Add todo programmatically
    addTodo(text) {
        const todo = this.store.addTodo(text);
        this.renderTodos();
        this.updateStats();
        return todo;
    }

    // Remove todo programmatically
    removeTodo(id) {
        this.store.removeTodo(id);
        this.renderTodos();
        this.updateStats();
    }

    // Toggle todo programmatically
    toggleTodo(id) {
        this.store.toggleTodo(id);
        this.renderTodos();
        this.updateStats();
    }
} 