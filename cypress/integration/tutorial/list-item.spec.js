describe('List todos', () => {
  beforeEach(() => {
    cy.seedAndVisit();
    cy.fixture('todos').as('todos');
  });

  it('properly displays completed items', () => {
    cy.get('@todos').then(todos => {
      const completedTodos = todos.filter(todo => todo.isComplete);
      cy.get('.todo-list li.completed')
        .should('have.length', completedTodos.length)
        .find('.toggle')
        .and('be.checked');
    });
  });

  it('shows remaining todos count in footer', () => {
    cy.get('@todos').then(todos => {
      const activeTodos = todos.filter(todo => !todo.isComplete);
      cy.checkActiveTodosCount(activeTodos.length);
    });
  });

  it('removes an item', () => {
    cy.server();
    cy.route({
      method: 'DELETE',
      url: '/api/todos/1',
      status: 200,
      response: {},
    });

    cy.get('.todo-list li').as('list');

    cy.get('@list')
      .first()
      .find('.destroy')
      .invoke('show')
      .click();

    cy.get('@todos').then(todos => {
      // here we remove the first item to simulate
      // delete based on the delete process above
      const remainingTodos = todos.slice(1);
      const activeTodos = remainingTodos.filter(todo => !todo.isComplete);
      cy.get('@list').should('have.length', remainingTodos.length);
      cy.checkActiveTodosCount(activeTodos.length);
    });
  });

  it('marks an imcomplete item complete', () => {
    cy.get('@todos').then(todos => {
      // const target = Cypress._.head(todos);

      // const updatedTodo = Cypress._.merge(target, { isComplete: true });

      const target = todos[0];
      const updatedTodo = { ...target, isComplete: true };

      // Stub update request for the first item
      cy.route('PUT', `/api/todos/${target.id}`, updatedTodo);
    });

    cy.get('.todo-list li')
      .first()
      .as('target');

    cy.get('@target')
      .find('.toggle')
      .click()
      .should('be.checked');

    cy.get('@target').should('have.class', 'completed');

    cy.get('@todos').then(todos => {
      // simulate an update by updating the first item similar to
      // the process above
      const target = todos[0];
      const updatedTodo = { ...target, isComplete: true };
      const updatedTodos = todos.map(todo =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      );
      const activeTodos = updatedTodos.filter(todo => !todo.isComplete);
      cy.checkActiveTodosCount(activeTodos.length);
    });
  });
});
