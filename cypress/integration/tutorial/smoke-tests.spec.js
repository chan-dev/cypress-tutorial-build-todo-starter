describe('Smoke tests', () => {
  beforeEach(() => {
    // We need to start from a clean state
    cy.request('GET', '/api/todos')
      .its('body')
      .each(todo => {
        cy.request('DELETE', `/api/todos/${todo.id}`);
      });

    cy.fixture('todos').as('todos');
  });

  context('with no todos', () => {
    it('creates todos', () => {
      cy.server();
      cy.route('POST', 'api/todos').as('create');

      const todos = ['Buy cp', 'Get a job', 'Save money'];

      cy.visit('/');

      // loop thru the todos from fixture and simulate the typing
      cy.wrap(todos).each((todo, i) => {
        cy.get('.new-todo')
          .type(todo)
          .type('{enter}');

        // NOTE: good practice to wait for any api call
        cy.wait('@create');

        cy.get('.todo-list li').should('have.length', i + 1);
      });
    });
  });

  context('with todos', () => {
    beforeEach(() => {
      cy.server();
      cy.route('POST', '/api/todos').as('create');
      cy.get('@todos').then(todos => {
        const resetTodos = todos.map(todo => ({ ...todo, isComplete: false }));

        // before visiting the page, save some todos
        cy.wrap(resetTodos).each(todo => {
          cy.request('POST', '/api/todos', todo);
        });

        // NOTE: take note that we execute cy.visit after
        // the create requests, so when we visit the page
        // there are already data
        cy.visit('/');
      });
    });

    it('loads the available todos on the server', () => {
      cy.get('@todos').then(todos => {
        cy.get('.todo-list li').should('have.length', todos.length);
      });
    });

    it('toggles the state of todos', () => {
      cy.server();
      cy.route('PUT', '/api/todos/*').as('update');

      const toggleAndWait = $el => {
        cy.wrap($el)
          .as('item')
          .find('.toggle')
          .click();

        cy.wait('@update');
      };

      // on each todo in ui
      cy.get('.todo-list li')
        .each($el => {
          toggleAndWait($el);
          cy.get('@item').should('have.class', 'completed');
        })
        .each($el => {
          toggleAndWait($el);
          cy.get('@item').should('not.have.class', 'completed');
        });
    });

    it('deletes an item successfully', () => {
      cy.server();
      cy.route('DELETE', '/api/todos/*').as('delete');

      cy.get('.todo-list li')
        .each(($el, i, $list) => {
          cy.wrap($el)
            .as('item')
            .find('.destroy')
            .invoke('show')
            .click();

          cy.wait('@delete');

          cy.wrap($el).should('not.exist');
          cy.wrap($list).should('have.length', $list.length - (i + 1));
        })
        .should('have.length', 0);
    });
  });
});
