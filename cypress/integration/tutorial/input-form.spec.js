describe('Input form', () => {
  beforeEach(() => {
    cy.seedAndVisit([]);
  });

  it('focuses input on load', () => {
    cy.focused().should('have.class', 'new-todo');
  });

  it('accepts input', () => {
    const typedText = 'buy cp';

    cy.get('.new-todo')
      .type(typedText)
      .should('have.value', typedText);
  });

  context('Form submission', () => {
    beforeEach(() => {
      cy.server();
    });

    it('Adds a new todo on submit', () => {
      const newItem = 'buy eggs';

      cy.route('POST', '/api/todos', {
        name: newItem,
        id: 1,
        isComplete: false,
      });
      cy.get('.new-todo')
        .type(newItem)
        .type('{enter}')
        .should('be.empty')
        .and('have.value', '');

      cy.get('.todo-list li')
        .should('have.length', 1)
        .and('contain', newItem);
    });

    it('Shows an error on failed form submission', () => {
      cy.route({
        url: '/api/todos',
        method: 'POST',
        status: 500, // simulate a server error
        response: {},
      });

      const newItem = 'Buy cp';

      cy.get('.new-todo')
        .type(newItem)
        .type('{enter}')
        .should('have.value', newItem); // make input value is not cleared

      cy.get('.todo-list li').should('not.exist');

      cy.get('.error').should('be.visible');
    });
  });
});
