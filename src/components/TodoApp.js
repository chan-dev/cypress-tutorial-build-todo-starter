import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import Footer from './Footer';
import { saveTodo, loadTodos, deleteTodo, updateTodo } from '../lib/service';
import { filterTodos } from '../lib/utils';

export default class TodoApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [],
      currentTodo: '',
      error: false,
    };

    this.handleNewTodoChange = this.handleNewTodoChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    loadTodos()
      .then(({ data }) =>
        this.setState({
          todos: data,
        })
      )
      .catch(err =>
        this.setState({
          error: true,
        })
      );
  }

  handleNewTodoChange(event) {
    this.setState({
      currentTodo: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const newTodo = { name: this.state.currentTodo, isComplete: false };
    saveTodo(newTodo)
      .then(({ data }) => {
        this.setState({
          todos: [...this.state.todos, data],
          currentTodo: '',
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: true,
        });
      });
  }

  handleDelete(id) {
    const todos = this.state.todos.filter(todo => todo.id !== id);

    deleteTodo(id)
      .then(({ data }) => {
        this.setState({
          todos,
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: true,
        });
      });
  }

  handleToggle(id) {
    const target = this.state.todos.find(todo => todo.id === id);
    const updatedTodo = { ...target, isComplete: !target.isComplete };

    updateTodo(id, updatedTodo)
      .then(({ data }) => {
        this.setState({
          todos: this.state.todos.map(todo =>
            todo.id === id ? updatedTodo : todo
          ),
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: true,
        });
      });
  }

  render() {
    const remaining = this.state.todos.filter(todo => !todo.isComplete).length;

    return (
      <Router>
        <div>
          <header className="header">
            <h1>todos</h1>
            {this.state.error ? <span className="error">error</span> : null}
            <TodoForm
              currentTodo={this.state.currentTodo}
              handleNewTodoChange={this.handleNewTodoChange}
              handleSubmit={this.handleSubmit}
            />
          </header>
          <section className="main">
            <Route
              path="/:filter?"
              render={({ match }) => (
                <TodoList
                  todos={filterTodos(this.state.todos, match.params.filter)}
                  handleDelete={this.handleDelete}
                  handleToggle={this.handleToggle}
                />
              )}
            />
          </section>
          <Footer remaining={remaining} />
        </div>
      </Router>
    );
  }
}
