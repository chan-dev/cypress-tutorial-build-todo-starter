export const filterTodos = (todos, filter) =>
  filter
    ? todos.filter(todo => todo.isComplete === (filter === 'completed'))
    : todos;
