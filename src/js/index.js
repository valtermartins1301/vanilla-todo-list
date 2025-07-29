import '../css/styles.css';
import TodoApp from './modules/TodoApp.js';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new TodoApp();
    app.init();
}); 