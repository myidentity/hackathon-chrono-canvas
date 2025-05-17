/**
 * Custom commands for Cypress tests
 * 
 * This file allows you to create custom commands and overwrite existing commands.
 */

// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  cy.get('[data-testid=email-input]').type(email);
  cy.get('[data-testid=password-input]').type(password);
  cy.get('[data-testid=login-button]').click();
});

// -- This is a child command --
Cypress.Commands.add('dragElement', { prevSubject: 'element' }, (subject, x, y) => {
  cy.wrap(subject)
    .trigger('mousedown', { which: 1 })
    .trigger('mousemove', { clientX: x, clientY: y })
    .trigger('mouseup');
});

// -- This is a dual command --
Cypress.Commands.add('timelineSeek', (position) => {
  cy.get('[data-testid=timeline-track]').then($track => {
    const width = $track.width();
    const x = width * (position / 100);
    cy.get('[data-testid=timeline-track]').click(x, 10);
  });
});

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Declare types for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      dragElement(x: number, y: number): Chainable<Element>;
      timelineSeek(position: number): Chainable<void>;
    }
  }
}
