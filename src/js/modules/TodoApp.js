import TodoStore from './TodoStore.js';
import TodoUI from './TodoUI.js';
import TodoController from './TodoController.js';

export default class TodoApp {
    constructor() {
        this.store = new TodoStore();
        this.ui = new TodoUI();
        this.controller = new TodoController(this.store, this.ui);
    }

    init() {
        // Initialize the controller which sets up all event listeners
        this.controller.init();
        
        // Load any existing todos from localStorage
        this.store.loadTodos();
        
        // Render the initial state
        this.controller.renderTodos();
        
        console.log('Todo App initialized successfully!');
    }
} 