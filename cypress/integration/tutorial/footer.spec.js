describe('Footer', () => {
  context('Check correct grammer for active todos status', () => {
    it('displays the singular form when only 1 todo active', () => {
      cy.seedAndVisit([
        {
          id: 1,
          name: 'Buy cp',
          isComplete: false,
        },
      ]);
      cy.get('.todo-count').should('contain.text', '1 todo left');
    });
    it('displays the plural form when only multiple active todos', () => {
      cy.seedAndVisit([
        {
          id: 1,
          name: 'Buy cp',
          isComplete: false,
        },
        {
          id: 2,
          name: 'Buy milk',
          isComplete: true,
        },
        {
          id: 3,
          name: 'Get a job',
          isComplete: false,
        },
      ]);
      cy.get('.todo-count').should('contain.text', '2 todos left');
    });
  });

  context('Check filters', () => {
    it('displays the correct set of todos based on filter', () => {
      cy.seedAndVisit();

      cy.fixture('todos').then(todos => {
        const activeTodos = todos.filter(todo => !todo.isComplete);
        const completedTodos = todos.filter(todo => todo.isComplete);

        const filters = [
          {
            link: 'All',
            expectedLength: todos.length,
          },
          {
            link: 'Active',
            expectedLength: activeTodos.length,
          },
          {
            link: 'Completed',
            expectedLength: completedTodos.length,
          },
        ];

        cy.wrap(filters).each(filter => {
          cy.contains(filter.link).click();
          cy.get('.todo-list li').should('have.length', filter.expectedLength);
        });
      });
    });
  });
});
