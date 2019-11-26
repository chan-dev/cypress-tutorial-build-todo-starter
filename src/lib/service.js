import axios from 'axios';

const url = 'http://localhost:3030/api/todos';

export const saveTodo = todo => axios.post(url, todo);
export const loadTodos = todo => axios.get(url);
export const deleteTodo = id => axios.delete(`${url}/${id}`);
export const updateTodo = (id, todo) => axios.put(`${url}/${id}`, todo);
