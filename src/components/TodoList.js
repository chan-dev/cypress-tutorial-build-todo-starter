import React from 'react';

const TodoItem = props => (
  <li className={props.todo.isComplete ? 'completed' : null}>
    <div className="view">
      <input
        className="toggle"
        type="checkbox"
        checked={props.todo.isComplete}
        onChange={() => props.handleToggle(props.todo.id)}
      />
      <label>{props.todo.name}</label>
      <button
        className="destroy"
        onClick={() => props.handleDelete(props.todo.id)}
      />
    </div>
  </li>
);

export default props => (
  <ul className="todo-list">
    {props.todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        handleDelete={props.handleDelete}
        handleToggle={props.handleToggle}
      />
    ))}
  </ul>
);
