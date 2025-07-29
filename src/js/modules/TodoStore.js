export default class TodoStore {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.storageKey = 'vanilla-todo-list';
    }

    // Add a new todo
    addTodo(text) {
        const todo = {
            id: this.generateId(),
            text: text.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.todos.push(todo);
        this.saveTodos();
        return todo;
    }

    // Remove a todo by ID
    removeTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
    }

    // Toggle todo completion status
    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
        }
    }

    // Update todo text
    updateTodo(id, text) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.text = text.trim();
            this.saveTodos();
        }
    }

    // Clear all completed todos
    clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveTodos();
    }

    // Set current filter
    setFilter(filter) {
        this.currentFilter = filter;
    }

    // Get filtered todos
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    // Get all todos
    getAllTodos() {
        return this.todos;
    }

    // Get active todos count
    getActiveCount() {
        return this.todos.filter(todo => !todo.completed).length;
    }

    // Get completed todos count
    getCompletedCount() {
        return this.todos.filter(todo => todo.completed).length;
    }

    // Get total todos count
    getTotalCount() {
        return this.todos.length;
    }

    // Save todos to localStorage
    saveTodos() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
        } catch (error) {
            console.error('Failed to save todos to localStorage:', error);
        }
    }

    // Load todos from localStorage
    loadTodos() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.todos = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load todos from localStorage:', error);
            this.todos = [];
        }
    }

    // Generate unique ID for todos
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
} 