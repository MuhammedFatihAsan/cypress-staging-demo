describe('Chat — inbound mesaj akışı', () => {
  it('Outbound intercept + inbound webhook simülasyonu', () => {
    cy.intercept('POST', '**/api/send').as('send');

    cy.visit('/');

    cy.get('[data-cy=chat-input]').type('Merhaba');
    cy.get('#send').click();  // 🔧 Enter yerine buton

    cy.wait('@send').its('response.statusCode').should('eq', 200);

    cy.fixture('inbound.json').then((payload) => {
      cy.task('sendInboundWebhook', payload).should('equal', true);
    });

    cy.contains('Hoş geldin!').should('be.visible');
  });
});
