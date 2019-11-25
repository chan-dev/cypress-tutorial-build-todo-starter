describe('App initialization', () => {
  it('Loading todos on page load', () => {
    cy.seedAndVisit();
    cy.fixture('todos').then(todos => {
      cy.get('.todo-list li').should('have.length', todos.length);
    });
  });

  it('Shows error on load error', () => {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/api/todos',
      status: 500,
      response: {},
    });
    cy.visit('/');

    cy.get('.error').should('be.visible');
  });
});
